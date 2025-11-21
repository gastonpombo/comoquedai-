import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Check, Zap } from "lucide-react"
import { EnvVarWarning } from "@/components/env-var-warning"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { addCredits } from "@/app/actions"

const plans = [
  {
    name: "Starter",
    credits: 50,
    price: "$5",
    description: "Perfect for trying out the platform.",
    features: ["50 AI Credits", "Access to all tools", "Standard support"],
    popular: false,
  },
  {
    name: "Pro",
    credits: 150,
    price: "$12",
    description: "Best value for regular creators.",
    features: ["150 AI Credits", "Priority generation", "Email support", "History access"],
    popular: true,
  },
  {
    name: "Power",
    credits: 500,
    price: "$35",
    description: "For heavy users and professionals.",
    features: ["500 AI Credits", "Highest priority", "24/7 Support", "API Access"],
    popular: false,
  },
]

export default async function BillingPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <EnvVarWarning />
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="bg-zinc-950">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Top Up Your Credits</h2>
            <p className="text-zinc-400 mt-2">Choose a package that suits your creative needs.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col border-border bg-card/50 ${plan.popular ? "border-primary/50 shadow-lg shadow-primary/10" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/ one-time</span>
                  </div>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <form action={addCredits} className="w-full">
                    <input type="hidden" name="amount" value={plan.credits} />
                    <Button
                      className={`w-full ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Buy {plan.credits} Credits
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 rounded-lg border border-border bg-card/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Payments are processed securely via Lemon Squeezy.
              <br />
              This is a demo environment. Clicking "Buy" will simulate a successful transaction.
            </p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
