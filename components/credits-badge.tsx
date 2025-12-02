"use client"

import { Badge } from "@/components/ui/badge"
import { Coins, Loader2, Zap } from "lucide-react"
import { useCredits } from "@/contexts/credits-context"
import { motion } from "framer-motion"

export function CreditsBadge() {
  const { credits, loading } = useCredits()

  if (loading) {
    return (
      <Badge variant="secondary" className="gap-2 px-3 py-1.5 text-sm bg-white/5 border-white/10 text-zinc-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Cargando...
      </Badge>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Badge
        variant="secondary"
        className="gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-4 py-1.5 text-sm text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] cursor-pointer"
      >
        <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="font-semibold tracking-wide">{credits ?? 0} Créditos</span>
      </Badge>
    </motion.div>
  )
}
