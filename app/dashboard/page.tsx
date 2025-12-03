import { createClient } from "@/lib/supabase/server"
import { Dashboard } from "@/components/dashboard"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Verificación de Auth
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 2. Cargar Workflows
  const { data: workflows } = await supabase
    .from('workflows')
    .select('*')
    .order('id', { ascending: true })

  // 3. NUEVO: Cargar Perfil del Usuario (Para obtener créditos, plan y email)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 4. Pasar todo al componente visual
  return (
    <main>
      <Dashboard
        onLogout={async () => {
          "use server"
          const sb = await createClient()
          await sb.auth.signOut()
          redirect("/login") // Esto es un fallback, el sidebar lo maneja en cliente
        }}
        workflows={workflows || []}
        userProfile={profile} // <--- Pasamos el perfil real
        userEmail={user.email} // <--- Pasamos el email real
      />
    </main>
  )
}