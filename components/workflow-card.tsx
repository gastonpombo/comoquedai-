"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Sparkles, Loader2, ImageOff, Zap, ArrowRight } from "lucide-react"
import { useCredits } from "@/contexts/credits-context"
import { InsufficientCreditsDialog } from "@/components/insufficient-credits-dialog"
import { RunWorkflowDialog } from "@/components/run-workflow-dialog"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface Workflow {
  id: number
  title: string
  description: string
  cost: number
  image_url: string
  execution_type?: string
  inputs_config?: any
}

interface WorkflowCardProps {
  workflow: Workflow
  onNavigateToStore?: () => void
}

export function WorkflowCard({ workflow, onNavigateToStore }: WorkflowCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [justGenerated, setJustGenerated] = useState(false)

  const { credits, refreshCredits } = useCredits()

  const handleInitialClick = () => {
    const currentCredits = credits ?? 0
    if (currentCredits < workflow.cost) {
      setShowInsufficientDialog(true)
      return
    }
    setShowConfigDialog(true)
  }

  // --- FUNCIÓN BLINDADA ---
  const executeGeneration = async (inputs: any = {}): Promise<boolean> => {
    setIsGenerating(true)
    try {
      // 1. LLAMADA CRÍTICA
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: workflow.id,
          inputs: inputs
        }),
      })

      // Intentamos parsear JSON, si falla es error de red
      const data = await response.json().catch(() => null)

      if (!response.ok || !data) {
        if (response.status === 402) {
          setShowInsufficientDialog(true)
          return false
        }
        throw new Error(data?.error || "Error de conexión o timeout")
      }

      // 2. ÉXITO (Si llegamos aquí, la imagen existe en DB)
      // Retornamos true INMEDIATAMENTE para que el modal siga con la siguiente foto
      // Las actualizaciones visuales las hacemos "fire and forget" (sin await bloqueante)

      setJustGenerated(true)

      // Actualizar créditos sin bloquear el flujo principal
      refreshCredits().catch(e => console.warn("No se pudo refrescar créditos:", e))

      setTimeout(() => setJustGenerated(false), 3000)

      return true

    } catch (error: any) {
      console.error("Error en executeGeneration:", error)
      // Solo mostramos toast de error si NO es una cancelación masiva
      toast.error("Error al generar", { description: error.message })
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-primary/50 transition-all duration-300 shadow-xl">
          <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
            {workflow.image_url ? (
              <Image
                src={workflow.image_url}
                alt={workflow.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized={true}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">
                <ImageOff className="h-10 w-10 opacity-50" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            {/* Cost Badge */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
              <Zap className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">{workflow.cost}</span>
            </div>

            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-md bg-primary/50 animate-pulse" />
                    <Loader2 className="relative h-10 w-10 animate-spin text-primary" />
                  </div>
                  <span className="text-sm font-medium text-white tracking-wide animate-pulse">Creando magia...</span>
                </div>
              </div>
            )}
          </div>

          <CardContent className="p-5 relative z-10">
            <h3 className="font-bold leading-tight text-white text-xl mb-2 group-hover:text-primary transition-colors">{workflow.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{workflow.description}</p>
          </CardContent>

          <CardFooter className="p-5 pt-0">
            <Button
              className="w-full h-11 gap-2 bg-white text-black hover:bg-white/90 font-semibold shadow-lg shadow-white/5 group-hover:shadow-primary/20 transition-all"
              onClick={handleInitialClick}
              disabled={isGenerating || justGenerated}
            >
              {isGenerating ? (
                "Procesando"
              ) : (
                <>
                  Generar Ahora <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <InsufficientCreditsDialog
        open={showInsufficientDialog}
        onOpenChange={setShowInsufficientDialog}
        requiredCredits={workflow.cost}
        currentCredits={credits ?? 0}
        onGoToStore={() => { setShowInsufficientDialog(false); onNavigateToStore?.() }}
      />

      <RunWorkflowDialog
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
        workflow={workflow}
        onGenerate={executeGeneration}
      />
    </>
  )
}