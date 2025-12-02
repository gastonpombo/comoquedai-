"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowRight, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface AuthFormProps {
  onSuccess?: () => void
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
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
          description: "Por favor revisa tu email para confirmar tu cuenta.",
        })
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/20 p-1 rounded-xl mb-6">
            <TabsTrigger
              value="login"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              Registrarse
            </TabsTrigger>
          </TabsList>

          {/* LOGIN FORM */}
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Bienvenido
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Ingresa tus credenciales para acceder al panel.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-0">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@agencia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/20 border-white/10 focus:border-primary/50 text-white placeholder:text-zinc-600 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-300">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-black/20 border-white/10 focus:border-primary/50 text-white h-11"
                  />
                </div>
              </CardContent>
              <CardFooter className="px-0 pt-2">
                <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ingresar"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          {/* REGISTER FORM */}
          <TabsContent value="register">
            <form onSubmit={handleSignUp}>
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold text-white">Crear Cuenta</CardTitle>
                <CardDescription className="text-zinc-400">
                  Únete a la plataforma líder para agencias.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-0">
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-zinc-300">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@agencia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/20 border-white/10 focus:border-primary/50 text-white placeholder:text-zinc-600 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-zinc-300">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-black/20 border-white/10 focus:border-primary/50 text-white h-11"
                  />
                </div>
              </CardContent>
              <CardFooter className="px-0 pt-2">
                <Button type="submit" className="w-full h-11 bg-white text-black hover:bg-white/90 font-semibold" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                    <span className="flex items-center gap-2">
                      Registrarse <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  )
}