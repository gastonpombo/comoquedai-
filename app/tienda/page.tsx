import { Header } from "@/components/header"
import { WorkflowsGrid } from "@/components/workflows-grid"

export default function TiendaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Tienda de Workflows</h2>
          <p className="mt-1 text-muted-foreground">Explora todos los workflows disponibles para crear tus imágenes</p>
        </div>
        <WorkflowsGrid />
      </main>
    </div>
  )
}
