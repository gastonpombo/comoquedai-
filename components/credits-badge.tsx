"use client"

import { Badge } from "@/components/ui/badge"
import { Coins, Loader2 } from "lucide-react"
import { useCredits } from "@/contexts/credits-context"

export function CreditsBadge() {
  const { credits, loading } = useCredits()

  if (loading) {
    return (
      <Badge variant="secondary" className="gap-2 px-3 py-1.5 text-sm">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Cargando...
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className="gap-2 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-600 hover:bg-amber-500/20"
    >
      <Coins className="h-3.5 w-3.5" />
      Créditos Disponibles: {credits ?? 0}
    </Badge>
  )
}
