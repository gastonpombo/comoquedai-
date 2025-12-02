import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { workflowId, inputs } = body 

    // Obtener Workflow
    const { data: workflow } = await supabase.from('workflows').select('*').eq('id', workflowId).single()
    if (!workflow) return NextResponse.json({ error: 'Workflow error' }, { status: 404 })

    // Verificar Créditos
    const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single()
    if (!profile || profile.credits < workflow.cost) {
        return NextResponse.json({ error: 'Créditos insuficientes' }, { status: 402 })
    }

    let resultImageUrl = ""

    // Ejecución ComfyDeploy
    if (workflow.execution_type === 'comfy') {
        const comfyPayload = {
            deployment_id: workflow.external_id,
            inputs: { ...inputs }
        }

        const runResponse = await fetch("https://api.comfydeploy.com/api/run/deployment/queue", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`
            },
            body: JSON.stringify(comfyPayload)
        })

        const runData = await runResponse.json()
        if (!runData.run_id) throw new Error(`Error Comfy: ${JSON.stringify(runData)}`)

        // POLLING
        let status = "queued"
        let attempts = 0
        const MAX_ATTEMPTS = 300 // 10 minutos
        
        while (status !== "success" && status !== "failed" && attempts < MAX_ATTEMPTS) {
            await new Promise(r => setTimeout(r, 2000))
            const statusResponse = await fetch(`https://api.comfydeploy.com/api/run/${runData.run_id}`, {
                headers: { 'Authorization': `Bearer ${process.env.COMFY_DEPLOY_API_KEY}` }
            })
            const statusData = await statusResponse.json()
            status = statusData.status
            
            if (status === "success") {
                const outputs = statusData.outputs
                if (outputs && outputs.length > 0) {
                    const images = outputs[0]?.data?.images || []
                    if (images.length > 0) {
                        // Si hay múltiples imágenes (Infografía), guardar JSON array
                        if (images.length === 1) resultImageUrl = images[0].url
                        else resultImageUrl = JSON.stringify(images.map((img: any) => img.url))
                    } else {
                        resultImageUrl = outputs[0]?.url
                    }
                }
            }
            attempts++
        }
        if (status !== "success") throw new Error("Tiempo agotado")
    }

    // Restar Créditos
    await supabase.rpc('decrement_credits', { row_id: user.id, amount: workflow.cost })

    // Guardar Historial (Con batch_id)
    const batchId = inputs._batch_id || null
    const cleanInputs = { ...inputs }
    delete cleanInputs._batch_id

    const { error: insertError } = await supabase.from('generations').insert({
        user_id: user.id,
        workflow_id: workflowId,
        input_image_url: inputs.input_image || inputs.foto_producto || inputs.producto || null,
        result_image_url: resultImageUrl,
        prompt_used: cleanInputs,
        batch_id: batchId
    })

    if (insertError) console.error("Error DB:", insertError)

    return NextResponse.json({ success: true, imageUrl: resultImageUrl })

  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ error: error.message || "Error desconocido" }, { status: 500 })
  }
}