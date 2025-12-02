import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LandingPage } from "@/components/landing-page" // Asegúrate de tener este componente

export default async function Home() {
  const supabase = await createClient()

  // 1. Verificamos si ya existe una sesión
  const { data: { user } } = await supabase.auth.getUser()

  // 2. SEMÁFORO:
  // Si ya tiene usuario, no tiene sentido mostrarle la landing de ventas.
  // Lo mandamos directo a su panel de control.
  if (user) {
    redirect("/dashboard")
  }

  // 3. Si no hay usuario, mostramos la Landing Page pública
  return <LandingPage />
}