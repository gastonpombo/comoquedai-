import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function EnvVarWarning() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Alert
        variant="destructive"
        className="max-w-md border-destructive/50 bg-destructive/20 text-destructive-foreground"
      >
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Missing Configuration</AlertTitle>
        <AlertDescription className="mt-2">
          <p>Your Supabase environment variables are missing.</p>
          <p className="mt-2 text-sm text-destructive-foreground/80">
            Please add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your
            project's environment variables in the "Vars" section of the sidebar.
          </p>
          <p className="mt-2 text-xs text-destructive-foreground/60">
            Tip: Ensure there are no extra spaces or quotes around the values.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
