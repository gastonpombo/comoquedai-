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
import { AlertCircle, Coins } from "lucide-react"
import { toast } from "sonner"

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Créditos Insuficientes</DialogTitle>
          <DialogDescription className="text-center">
            No tienes suficientes créditos para ejecutar este workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-8 py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Tienes</p>
            <p className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
              <Coins className="h-5 w-5 text-amber-500" />
              {currentCredits}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Necesitas</p>
            <p className="flex items-center justify-center gap-1 text-2xl font-bold text-destructive">
              <Coins className="h-5 w-5" />
              {requiredCredits}
            </p>
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={onGoToStore} className="w-full">
            Comprar Créditos
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
