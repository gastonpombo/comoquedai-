import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Usamos el cliente ADMIN porque no hay usuario logueado en esta petición
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Usa la Service Role Key (no la Anon)
)

export async function POST(request: Request) {
  console.log("🔔 [Webhook] Notificación recibida de ComfyDeploy")

  try {
    const data = await request.json()
    const { run_id, status, outputs } = data

    console.log(`Run ID: ${run_id}, Status: ${status}`)

    if (status === 'success') {
      // Extraer URL de la imagen
      const resultImageUrl = outputs[0]?.data?.images?.[0]?.url || outputs[0]?.url

      // Actualizar Supabase
      const { error } = await supabaseAdmin
        .from('generations')
        .update({ 
          result_image_url: resultImageUrl,
          status: 'completed'
        })
        .eq('run_id', run_id)

      if (error) console.error("Error actualizando BD:", error)
        
    } else if (status === 'failed') {
      await supabaseAdmin
        .from('generations')
        .update({ status: 'failed' })
        .eq('run_id', run_id)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Webhook Error:", error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}