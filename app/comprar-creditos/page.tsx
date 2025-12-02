import { Header } from "@/components/header"
import { Button } from "@/components-old/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components-old/ui/card"
import { Check, Zap } from "lucide-react"

const plans = [
  {
    name: "Básico",
    credits: 100,
    price: 9.99,
    features: ["100 créditos", "Soporte por email", "Acceso a workflows básicos"],
  },
  {
    name: "Pro",
    credits: 500,
    price: 39.99,
    popular: true,
    features: ["500 créditos", "Soporte prioritario", "Todos los workflows", "Sin marcas de agua"],
  },
  {
    name: "Enterprise",
    credits: 2000,
    price: 129.99,
    features: ["2000 créditos", "Soporte 24/7", "API access", "Workflows personalizados"],
  },
]

export default function ComprarCreditosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Comprar Créditos</h2>
          <p className="mt-1 text-muted-foreground">Elige el plan que mejor se adapte a tus necesidades</p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "relative border-primary shadow-lg" : ""}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    <Zap className="h-3 w-3" />
                    Más Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.credits} créditos</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/único pago</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Comprar Ahora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
