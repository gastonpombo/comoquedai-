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
        features: ["10 Créditos de prueba", "Acceso a workflows básicos", "Velocidad estándar"],
        current: true,
    },
    {
        name: "Básico",
        credits: 100,
        price: "$19",
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC,
        features: ["100 Créditos / mes", "Acceso a todos los workflows", "Soporte por email"],
    },
    {
        name: "Premium",
        credits: 500,
        price: "$49",
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
        features: ["500 Créditos / mes", "Soporte prioritario", "Generaciones rápidas", "Acceso a betas"],
        popular: true,
    },
    {
        name: "Empresas",
        credits: 2000,
        price: "$99",
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_DFY,
        features: ["2000 Créditos / mes", "API Access", "Soporte dedicado", "Workflows privados"],
    },
]

export function PricingView() {
    const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null)
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams.get("payment") === "success") {
            toast.success("¡Suscripción activa!", {
                description: "Tus créditos mensuales se han añadido."
            })
        } else if (searchParams.get("payment") === "cancelled") {
            toast.info("Operación cancelada", {
                description: "No se ha realizado ningún cobro."
            })
        }
    }, [searchParams])

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
            toast.error("Error al iniciar suscripción", { description: error.message })
            setLoadingPriceId(null)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto px-4">
            {PLANS.map((plan) => (
                <Card
                    key={plan.name}
                    className={`
                relative flex flex-col transition-all duration-200 border
                ${plan.popular
                            ? "border-primary bg-white shadow-2xl shadow-primary/20 scale-105 z-10"
                            : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
                        }
                ${plan.current
                            ? "bg-zinc-50 border-zinc-200 opacity-90"
                            : ""
                        }
            `}
                >
                    {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                            Más Popular
                        </div>
                    )}

                    {plan.current && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-200 border border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-600 shadow-sm">
                            Tu Plan Actual
                        </div>
                    )}

                    <CardHeader>
                        <CardTitle className="text-xl text-zinc-900 font-bold">{plan.name}</CardTitle>
                        <CardDescription className="text-zinc-500">{plan.credits} Créditos mensuales</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                        <div className="mb-6 flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-zinc-900">{plan.price}</span>
                            {plan.priceId && <span className="text-sm text-zinc-500 font-medium">/ mes</span>}
                        </div>
                        <ul className="space-y-3 text-sm text-zinc-600">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-5 h-5 rounded-full ${plan.current ? "bg-zinc-200 text-zinc-400" : "bg-primary/10 text-primary"}`}>
                                        <Check className={`h-3 w-3 ${plan.current ? "text-zinc-500" : "text-primary"}`} />
                                    </div>
                                    <span className={plan.current ? "text-zinc-500" : "text-zinc-900"}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>

                    <CardFooter>
                        <Button
                            className="w-full font-semibold"
                            variant={plan.popular ? "default" : plan.current ? "secondary" : "outline"}
                            style={!plan.popular && !plan.current ? { color: '#18181b', borderColor: '#e4e4e7' } : {}}
                            onClick={() => handleCheckout(plan.priceId || null)}
                            disabled={loadingPriceId !== null || plan.current === true}
                        >
                            {loadingPriceId === plan.priceId && loadingPriceId !== null && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {plan.current ? "Plan Actual" : "Suscribirse"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}