import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover' as any, // <--- ACTUALIZA ESTO AQUÍ TAMBIÉN
})

// IMPORTANTE: Usamos la Service Role Key para poder escribir sin ser el usuario
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error(`❌ Error de firma Webhook: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Manejar el evento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Leer la metadata que guardamos en el paso anterior
    const userId = session.metadata?.userId
    const creditsToAdd = Number(session.metadata?.credits)

    if (userId && creditsToAdd) {
      console.log(`💰 Pago recibido! Añadiendo ${creditsToAdd} créditos al usuario ${userId}`)

      // 1. Obtener créditos actuales
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single()

      const currentCredits = profile?.credits || 0
      const newCredits = currentCredits + creditsToAdd

      // 2. Actualizar créditos
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', userId)

      if (error) {
        console.error('❌ Error actualizando créditos en Supabase:', error)
        return NextResponse.json({ error: 'Error DB' }, { status: 500 })
      }

      console.log('✅ Créditos actualizados correctamente')
    }
  }

  return NextResponse.json({ received: true })
}