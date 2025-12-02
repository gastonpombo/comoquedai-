import { AuthForm } from "@/components/auth-form" // <--- Importación correcta
import { Sparkles } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo y Título */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Bienvenido a ImageAI</h1>
          <p className="text-sm text-zinc-400">
            Inicia sesión para empezar a crear imágenes increíbles
          </p>
        </div>

        {/* Formulario de Autenticación */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl">
          <AuthForm />
        </div>
        
      </div>
    </div>
  )
}