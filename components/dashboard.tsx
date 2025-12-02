"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { WorkflowsGrid } from "@/components/workflows-grid"
import { PricingView } from "@/components/pricing-view"
import { GenerationsGallery } from "@/components/generations-gallery" // <--- Agregamos la galería
import { Construction } from "lucide-react"

interface Workflow {
  id: number
  title: string
  description: string
  cost: number
  image_url: string
  execution_type?: string
}

interface DashboardProps {
  onLogout: () => void
  workflows: Workflow[]
}

export function Dashboard({ onLogout, workflows }: DashboardProps) {
  const [currentView, setCurrentView] = useState("dashboard")

  const handleNavigateToStore = () => {
    setCurrentView("comprar-creditos")
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
      case "tienda":
        return (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">
                {currentView === "dashboard" ? "Workflows Disponibles" : "Tienda de Workflows"}
              </h2>
              <p className="mt-1 text-muted-foreground">Selecciona un workflow para generar imágenes con IA</p>
            </div>
            <WorkflowsGrid workflows={workflows} onNavigateToStore={handleNavigateToStore} />
          </>
        )
      case "mis-generaciones":
        return (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold">Mis Generaciones</h2>
             {/* Aquí mostramos la galería real */}
             <GenerationsGallery />
          </div>
        )
      case "comprar-creditos":
        return <PricingView />
      default:
        return (
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
            <Construction className="h-16 w-16 opacity-50" />
            <p>Sección en construcción</p>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={onLogout} currentView={currentView} onNavigate={setCurrentView} />
      <div className="ml-64 flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}