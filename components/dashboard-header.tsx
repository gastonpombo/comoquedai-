import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Zap } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export async function DashboardHeader() {
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

  let credits = 0
  if (user) {
    const { data } = await supabase.from("user_credits").select("balance").eq("user_id", user.id).single()

    credits = data?.balance || 0
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/50 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <Zap className="h-4 w-4 fill-primary" />
          <span>{credits} Credits</span>
        </div>
      </div>
    </header>
  )
}
