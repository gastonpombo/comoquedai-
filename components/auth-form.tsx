"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AuthForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSignUp, setIsSignUp] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  async function handleDevLogin() {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: "demo@nanobanana.com",
        password: "demo1234",
      })
      if (error) throw error
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("Dev user not found. Please create a user with email: demo@nanobanana.com and password: demo1234")
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage("Check your email to confirm your account")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xl">
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <Alert
              variant="destructive"
              className="border-destructive/50 bg-destructive/20 text-destructive-foreground"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert className="border-primary/50 bg-primary/20 text-primary-foreground">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              required
              type="email"
              className="border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              required
              type="password"
              className="border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Development</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary bg-transparent"
            onClick={handleDevLogin}
            disabled={isLoading}
          >
            <Lock className="mr-2 h-4 w-4" />
            Dev Login (Skip Auth)
          </Button>

          <Button
            variant="link"
            className="text-sm text-muted-foreground hover:text-primary"
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
