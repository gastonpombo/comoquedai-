import { Header } from "@/components/header"
import { ImageIcon } from "lucide-react"

export default function MisGeneracionesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Mis Generaciones</h2>
          <p className="mt-1 text-muted-foreground">Historial de todas tus imágenes generadas</p>
        </div>
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">Aún no tienes generaciones</p>
          <p className="text-xs text-muted-foreground">Selecciona un workflow para comenzar</p>
        </div>
      </main>
    </div>
  )
}
