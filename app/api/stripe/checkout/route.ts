import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover' as any,
})

// Mapa de créditos por suscripción mensual
const CREDITS_MAP: Record<string, number> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC!]: 100,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM!]: 500,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_DFY!]: 2000,
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() { } } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { priceId } = body

  // Debug: Ver qué está llegando y qué tenemos configurado
  if (!CREDITS_MAP[priceId]) {
    console.error("❌ Error de Precio no encontrado.")
    console.error("Recibido:", priceId)
    console.error("Configurados en Vercel:", Object.keys(CREDITS_MAP))
    return NextResponse.json({ error: 'ID de precio no configurado en el servidor' }, { status: 400 })
  }

  const creditsAmount = CREDITS_MAP[priceId]

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // CAMBIO CLAVE: Modo suscripción
      mode: 'subscription',

      success_url: `${req.headers.get('origin')}/dashboard?payment=success`,
      cancel_url: `${req.headers.get('origin')}/dashboard?payment=cancelled`,
      customer_email: user.email,

      // Metadata para el Webhook
      subscription_data: {
        metadata: {
          userId: user.id,
          credits: creditsAmount.toString(),
          planType: 'monthly'
        }
      },
      // También lo ponemos en metadata de la sesión por seguridad
      metadata: {
        userId: user.id,
        credits: creditsAmount.toString()
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}