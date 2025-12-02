"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

// Asegúrate de tener estos IDs en tu .env.local en Vercel
const PLANS = [
  {
    name: "Básico",
    credits: 100,
    price: "$19",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC, 
    features: ["100 Créditos", "Acceso a todos los workflows"],
  },
  {
    name: "Premium",
    credits: 500,
    price: "$49",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM, 
    features: ["500 Créditos", "Soporte prioritario", "Generaciones rápidas"],
    popular: true,
  },
  {
    name: "Empresas",
    credits: 2000,
    price: "$99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_DFY, 
    features: ["2000 Créditos", "API Access", "Soporte dedicado"],
  },
]

export function PricingView() {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Detectar si venimos de un pago exitoso de Stripe
  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      // CORRECCIÓN AQUÍ: Sintaxis correcta de Sonner
      toast.success("¡Pago exitoso!", {
        description: "Tus créditos se han añadido a tu cuenta."
      })
    } else if (searchParams.get("payment") === "cancelled") {
      toast.info("Pago cancelado", {
        description: "No se te ha cobrado nada."
      })
    }
  }, [searchParams])

  const handleCheckout = async (priceId: string | undefined) => {
    if (!priceId) {
      toast.error("Error de configuración", { description: "Falta el ID del precio en las variables de entorno." })
      return
    }

    setLoadingPriceId(priceId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      // Redirigir a la pasarela de Stripe
      window.location.href = data.url

    } catch (error: any) {
      toast.error("Error al iniciar pago", { description: error.message })
      setLoadingPriceId(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
      {PLANS.map((plan) => (
        <Card key={plan.name} className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg shadow-primary/20" : "border-zinc-800 bg-zinc-900/50"}`}>
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Más Popular
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
            <CardDescription>{plan.credits} Créditos</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              <span className="text-muted-foreground">/ único</span>
            </div>
            <ul className="space-y-2 text-sm text-zinc-300">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleCheckout(plan.priceId)}
                disabled={loadingPriceId !== null}
            >
              {loadingPriceId === plan.priceId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Comprar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}