"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Coins, Zap, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface InsufficientCreditsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requiredCredits: number
  currentCredits: number
  onGoToStore: () => void
}

export function InsufficientCreditsDialog({
  open,
  onOpenChange,
  requiredCredits,
  currentCredits,
  onGoToStore,
}: InsufficientCreditsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-950/90 border-white/10 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-white">¡Ups! Créditos Insuficientes</DialogTitle>
          <DialogDescription className="text-center text-zinc-400 text-base mt-2">
            Necesitas más energía para ejecutar este workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-6 py-6">
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 w-32">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Tienes</p>
            <p className="flex items-center justify-center gap-1.5 text-2xl font-bold text-white">
              <Coins className="h-5 w-5 text-zinc-500" />
              {currentCredits}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-red-500/10 border border-red-500/20 w-32 shadow-inner">
            <p className="text-xs text-red-400 uppercase tracking-wider font-semibold mb-1">Necesitas</p>
            <p className="flex items-center justify-center gap-1.5 text-2xl font-bold text-red-500">
              <Zap className="h-5 w-5 fill-red-500" />
              {requiredCredits}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-col">
          <Button
            onClick={onGoToStore}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 group"
          >
            Recargar Créditos <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-zinc-400 hover:text-white hover:bg-white/5"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
