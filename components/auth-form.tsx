"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // <--- Importamos esto
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

// Hacemos que la prop sea opcional (?)
interface AuthFormProps {
  onSuccess?: () => void
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter() // <--- Hook de navegación
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error("Error al iniciar sesión", {
          description: error.message,
        })
      } else {
        toast.success("¡Bienvenido de nuevo!")
        
        // --- AQUÍ ESTABA EL ERROR ---
        // Ahora verificamos: Si existe onSuccess, lo usamos.
        // Si no, redirigimos al dashboard nosotros mismos.
        if (onSuccess) {
          onSuccess()
        } else {
          router.refresh() // Actualiza los componentes del servidor
          router.push("/dashboard")
        }
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error("Error al registrarse", {
          description: error.message,
        })
      } else {
        toast.success("Cuenta creada", {
          description: "Por favor revisa tu email para confirmar tu cuenta (o inicia sesión si desactivaste la confirmación).",
        })
        // Opcional: Redirigir o limpiar formulario
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border-0 bg-transparent shadow-none">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50">
          <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>
        
        {/* LOGIN FORM */}
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardHeader className="px-0">
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>
                Ingresa tu email y contraseña para acceder.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@ejemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </CardContent>
            <CardFooter className="px-0">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ingresar
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        {/* REGISTER FORM */}
        <TabsContent value="register">
          <form onSubmit={handleSignUp}>
            <CardHeader className="px-0">
              <CardTitle>Crear Cuenta</CardTitle>
              <CardDescription>
                Crea una cuenta nueva para empezar a usar ImageAI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input 
                  id="register-email" 
                  type="email" 
                  placeholder="m@ejemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <Input 
                  id="register-password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </CardContent>
            <CardFooter className="px-0">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrarse
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}