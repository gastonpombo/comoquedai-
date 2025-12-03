"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

const PLANS = [
  {
    name: "Gratis",
    credits: 10,
    price: "$0",
    priceId: null,
    features: ["10 Créditos de regalo", "Acceso a workflows básicos", "Velocidad estándar"],
    current: true,
  },
  {
    name: "Básico",
    credits: 100,
    price: "$19",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC,
    features: ["100 Créditos", "Acceso a todos los workflows", "Soporte por email"],
  },
  {
    name: "Premium",
    credits: 500,
    price: "$49",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
    features: ["500 Créditos", "Soporte prioritario", "Generaciones rápidas", "Acceso a betas"],
    popular: true,
  },
  {
    name: "Empresas",
    credits: 2000,
    price: "$99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_DFY,
    features: ["2000 Créditos", "API Access", "Soporte dedicado", "Workflows privados"],
  },
]

export function PricingView() {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("¡Pago exitoso!", {
        description: "Tus créditos se han añadido a tu cuenta."
      })
    } else if (searchParams.get("payment") === "cancelled") {
      toast.info("Pago cancelado", {
        description: "No se te ha cobrado nada."
      })
    }
  }, [searchParams])

  // Aceptamos string, null o undefined
  const handleCheckout = async (priceId: string | null | undefined) => {
    if (!priceId) return

    setLoadingPriceId(priceId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      window.location.href = data.url

    } catch (error: any) {
      toast.error("Error al iniciar pago", { description: error.message })
      setLoadingPriceId(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
      {PLANS.map((plan) => (
        <Card
          key={plan.name}
          className={`relative flex flex-col transition-all duration-200 
                ${plan.popular ? "border-primary shadow-lg shadow-primary/10 scale-105 z-10" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"}
                ${plan.current ? "bg-zinc-900/80 border-zinc-700" : ""}
            `}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              Más Popular
            </div>
          )}

          {plan.current && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-700 px-3 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 shadow-sm">
              Tu Plan
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
            <CardDescription>{plan.credits} Créditos</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              {plan.priceId && <span className="text-muted-foreground">/ pago único</span>}
            </div>
            <ul className="space-y-3 text-sm text-zinc-300">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className={`h-4 w-4 ${plan.current ? "text-zinc-500" : "text-primary"}`} />
                  <span className={plan.current ? "text-zinc-500" : ""}>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.popular ? "default" : plan.current ? "secondary" : "outline"}
              // CORRECCIÓN AQUÍ: Usamos "|| null" para que TypeScript no se queje si es undefined
              onClick={() => handleCheckout(plan.priceId || null)}
              disabled={loadingPriceId !== null || plan.current === true}
            >
              {loadingPriceId === plan.priceId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {plan.current ? "Plan Actual" : "Comprar"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}