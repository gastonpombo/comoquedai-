"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AuthFormProps {
  onSuccess?: () => void
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Estado para controlar qué pestaña se ve (Login o Registro)
  const [activeTab, setActiveTab] = useState("login")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const supabase = createClient()

  // --- GOOGLE ---
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error("Error con Google", { description: error.message })
      setIsGoogleLoading(false)
    }
  }

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error("Error al iniciar sesión", { description: error.message })
      } else {
        toast.success("¡Bienvenido de nuevo!")
        if (onSuccess) {
          onSuccess()
        } else {
          router.refresh()
          router.push("/dashboard")
        }
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  // --- REGISTRO (SIMPLE Y SEGURO) ---
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error("Error al registrarse", { description: error.message })
      } else if (data.user) {
        // ÉXITO:
        // 1. Avisamos al usuario
        toast.success("¡Cuenta creada con éxito!", {
          description: "Por favor, inicia sesión con tus credenciales.",
          duration: 5000, // Que dure un poco más para que lo lea
        })

        // 2. Lo enviamos a la pestaña de Login automáticamente
        setActiveTab("login")

        // 3. (Opcional) Limpiamos la contraseña para que la escriba de nuevo por seguridad,
        // pero dejamos el email puesto por comodidad.
        setPassword("")
      }

    } catch (error) {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border-0 bg-transparent shadow-none">

      <div className="mb-6">
        <Button
          variant="outline"
          className="w-full bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-white"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (