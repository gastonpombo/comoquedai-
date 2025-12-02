"use client"

import { WorkflowCard } from "@/components/workflow-card"

interface Workflow {
  id: number
  title: string
  description: string
  cost: number
  image_url: string
}

interface WorkflowsGridProps {
  workflows: Workflow[] // <--- Recibe la lista ya cargada
  onNavigateToStore?: () => void
}

export function WorkflowsGrid({ workflows, onNavigateToStore }: WorkflowsGridProps) {
  
  // Si la lista está vacía o es undefined
  if (!workflows || workflows.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center border-2 border-dashed rounded-lg">
        <p className="text-sm text-muted-foreground">
          No hay workflows en la base de datos (Tabla 'workflows' vacía)
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {workflows.map((workflow) => (
        <WorkflowCard 
            key={workflow.id} 
            workflow={workflow} 
            onNavigateToStore={onNavigateToStore} 
        />
      ))}
    </div>
  )
}