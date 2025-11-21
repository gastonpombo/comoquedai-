import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { services } from "@/lib/services"
import { EnvVarWarning } from "@/components/env-var-warning"

export default async function DashboardPage() {
  console.log("[v0] Checking env vars in DashboardPage")
  console.log("[v0] NEXT_PUBLIC_SUPABASE_URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("[v0] NEXT_PUBLIC_SUPABASE_ANON_KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <EnvVarWarning />
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="bg-background">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {user.user_metadata?.full_name || "Creator"}
            </h2>
            <p className="text-muted-foreground">Select a service to start creating.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group border-border bg-card/50 transition-all hover:border-primary/50 hover:bg-card"
              >
                <CardHeader>
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-background border border-border group-hover:border-primary/20 ${service.color}`}
                  >
                    <service.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-foreground">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-muted-foreground">
                    Cost: <span className="text-foreground">{service.cost} credits</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                  >
                    <Link href={`/service/${service.id}`}>
                      Start Creating <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
