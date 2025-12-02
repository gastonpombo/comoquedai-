"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, Sparkles } from "lucide-react"
import { useCredits } from "@/contexts/credits-context"
import { toast } from "sonner"

const pricingPlans = [
  {
    name: "Starter",
    price: 5,
    credits: 50,
    description: "Perfecto para probar la plataforma",
    features: ["50 créditos", "Acceso a todos los workflows", "Soporte por email"],
    popular: false,
  },
  {
    name: "Creator",
    price: 10,
    credits: 100,
    description: "Ideal para creadores de contenido",
    features: ["100 créditos", "Acceso a todos los workflows", "Soporte prioritario", "Sin marca de agua"],
    popular: true,
  },
  {
    name: "Pro",
    price: 25,
    credits: 300,
    description: "Para profesionales y equipos",
    features: ["300 créditos", "Acceso a todos los workflows", "Soporte 24/7", "Sin marca de agua", "API Access"],
    popular: false,
  },
]

export function PricingView() {
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null)
  const { addCredits } = useCredits()


  const handlePurchase = async (plan: (typeof pricingPlans)[0]) => {
    setPurchasingPlan(plan.name)

    // Simular redirección a Stripe por 2 segundos
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simular compra exitosa
    addCredits(plan.credits)
    setPurchasingPlan(null)

    toast({
      title: "¡Pago exitoso!",
      description: `Has comprado ${plan.credits} créditos. ¡Ya puedes usarlos!`,
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Comprar Créditos</h2>
        <p className="mt-1 text-muted-foreground">Elige el pack que mejor se adapte a tus necesidades</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Sparkles className="mr-1 h-3 w-3" />
                Más Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground"> USD</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handlePurchase(plan)}
                disabled={purchasingPlan !== null}
              >
                {purchasingPlan === plan.name ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirigiendo a Stripe...
                  </>
                ) : (
                  `Comprar Pack`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
