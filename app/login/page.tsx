import { AuthForm } from "@/components/auth-form"
import { Banana } from "lucide-react"
import { EnvVarWarning } from "@/components/env-var-warning"

export default function LoginPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <EnvVarWarning />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Banana className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome to Nano Banana Pro</h1>
          <p className="text-sm text-muted-foreground">Sign in to access your AI workspace</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
