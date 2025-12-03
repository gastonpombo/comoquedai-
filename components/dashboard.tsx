"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { WorkflowsGrid } from "@/components/workflows-grid"
import { PricingView } from "@/components/pricing-view"
import { GenerationsGallery } from "@/components/generations-gallery"

interface Workflow {
  id: number
  title: string
  description: string
  cost: number
  image_url: string
}

// CORRECCIÓN AQUÍ: Agregamos las propiedades que faltaban en la interfaz
interface DashboardProps {
  onLogout: () => void
  workflows: Workflow[]
  userProfile?: any  // <--- Nuevo
  userEmail?: string // <--- Nuevo
}

export function Dashboard({ onLogout, workflows, userProfile, userEmail }: DashboardProps) {
  const [currentView, setCurrentView] = useState("dashboard")

  const handleNavigateToStore = () => {
    setCurrentView("comprar-creditos")
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Workflows Disponibles</h2>
              <p className="mt-1 text-muted-foreground">Selecciona una herramienta para comenzar.</p>
            </div>
            <WorkflowsGrid workflows={workflows} onNavigateToStore={handleNavigateToStore} />
          </>
        )

      case "mis-generaciones":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Mis Generaciones</h2>
            <GenerationsGallery />
          </div>
        )

      case "comprar-creditos":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Comprar Créditos</h2>
            <PricingView />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Pasamos los datos a la Sidebar */}
      <Sidebar
        onLogout={onLogout}
        currentView={currentView}
        onNavigate={setCurrentView}
        userEmail={userEmail}
        userTier={userProfile?.tier}
      />

      <div className="ml-64 flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}