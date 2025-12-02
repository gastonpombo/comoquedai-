"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Sparkles, Loader2, ImageOff } from "lucide-react"
import { useCredits } from "@/contexts/credits-context"
import { InsufficientCreditsDialog } from "@/components/insufficient-credits-dialog"
import { RunWorkflowDialog } from "@/components/run-workflow-dialog"
import { toast } from "sonner"

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
      <Card className="group overflow-hidden transition-all hover:shadow-lg bg-zinc-900 border-zinc-800">
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
          {workflow.image_url ? (
             <Image
             src={workflow.image_url}
             alt={workflow.title}
             fill
             className="object-cover transition-transform duration-300 group-hover:scale-105"
             unoptimized={true}
           />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">
                <ImageOff className="h-10 w-10" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm font-medium text-white">Procesando...</span>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4 relative z-10 -mt-12">
          <h3 className="font-bold leading-tight text-white text-lg shadow-black drop-shadow-md">{workflow.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-zinc-300 shadow-black drop-shadow-md">{workflow.description}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" 
            size="sm" 
            onClick={handleInitialClick} 
            disabled={isGenerating || justGenerated}
          >
            {isGenerating ? "Procesando" : `Generar (${workflow.cost} créditos)`}
          </Button>
        </CardFooter>
      </Card>

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