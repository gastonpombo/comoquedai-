import { createClient } from "@/lib/supabase/server"
import { Dashboard } from "@/components/dashboard"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Verificación de Seguridad:
  // Como estamos en /dashboard, AQUÍ SÍ es obligatorio estar logueado.
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login") // Si no hay usuario, fuera.
  }

  // 2. Cargar los datos REALES desde Supabase
  const { data: workflows } = await supabase
    .from('workflows')
    .select('*')
    .order('id', { ascending: true })

  // 3. Renderizar el Dashboard con datos reales
  return (
    <main>
      <Dashboard 
        onLogout={async () => {
          "use server"
          const sb = await createClient()
          await sb.auth.signOut()
          redirect("/login")
        }} 
        workflows={workflows || []} 
      />
    </main>
  )
}