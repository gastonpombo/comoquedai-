"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { WorkflowsGrid } from "@/components/workflows-grid"
import { PricingView } from "@/components/pricing-view"
import { GenerationsGallery } from "@/components/generations-gallery"
import { Construction } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                {currentView === "dashboard" ? "Workflows Disponibles" : "Tienda de Workflows"}
              </h2>
              <p className="mt-2 text-muted-foreground text-lg">Selecciona un workflow para generar imágenes con IA</p>
            </div>
            <WorkflowsGrid workflows={workflows} onNavigateToStore={handleNavigateToStore} />
          </motion.div>
        )
      case "mis-generaciones":
        return (
          <motion.div
            key="generations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Mis Generaciones</h2>
            <GenerationsGallery />
          </motion.div>
        )
      case "comprar-creditos":
        return (
          <motion.div
            key="credits"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PricingView />
          </motion.div>
        )
      default:
        return (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
            <Construction className="h-16 w-16 opacity-20" />
            <p className="text-lg">Sección en construcción</p>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar onLogout={onLogout} currentView={currentView} onNavigate={setCurrentView} />
      <div className="ml-72 flex flex-1 flex-col transition-all duration-300">
        <Header />
        <main className="flex-1 p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}