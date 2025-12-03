import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover' as any, // <--- CAMBIO AQUÍ (y agregamos 'as any' para evitar peleas futuras)
})

// Mapa de créditos según el precio (Asegúrate que coincida con tus precios de Stripe)
// Esto es seguridad: el backend decide cuántos créditos vale cada ID.
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

  // Calcular créditos
  const creditsAmount = CREDITS_MAP[priceId]

  if (!creditsAmount) {
    return NextResponse.json({ error: 'Precio no válido o no configurado' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/dashboard?payment=success`,
      cancel_url: `${req.headers.get('origin')}/dashboard?payment=cancelled`,
      customer_email: user.email,
      // AQUÍ ESTÁ LA MAGIA: Guardamos ID y Créditos en el pago
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