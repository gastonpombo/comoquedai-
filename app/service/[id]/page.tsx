import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ServiceInterface } from "@/components/service-interface"
import { services } from "@/lib/services"
import { EnvVarWarning } from "@/components/env-var-warning"

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <EnvVarWarning />
  }

  const { id } = await params
  const service = services.find((s) => s.id === id)

  if (!service) {
    redirect("/")
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
          <div className="mb-6">
            <Link href="/" className="flex items-center text-sm text-zinc-400 hover:text-white mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 ${service.color}`}
              >
                <service.icon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{service.title}</h1>
                <p className="text-zinc-400">{service.description}</p>
              </div>
            </div>
          </div>

          <ServiceInterface service={service} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
