"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, ImageIcon, CreditCard, Sparkles, LogOut, Loader2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"

// 1. MENÚ SIMPLIFICADO
const navItems = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "mis-generaciones", label: "Mis Generaciones", icon: ImageIcon },
  { view: "comprar-creditos", label: "Comprar Créditos", icon: CreditCard },
]

interface SidebarProps {
  onLogout?: () => void
  currentView?: string
  onNavigate?: (view: string) => void
}

export function Sidebar({ currentView = "dashboard", onNavigate }: SidebarProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const supabase = createClient()
      // Intentamos cerrar sesión limpiamente
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error en signOut (no importa, forzamos salida):", error)
    } finally {
      // ESTO ES LA CLAVE:
      // Usamos window.location.href en lugar de router.replace.
      // Esto fuerza una recarga completa del navegador, limpiando cualquier caché de memoria o estado "zombi".
      window.location.href = "/"
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-white/10 bg-sidebar/50 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-white/5 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground">ImageAI</span>
            <span className="text-xs text-muted-foreground">Agency Suite</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = currentView === item.view
            return (
              <button
                key={item.view}
                onClick={() => onNavigate?.(item.view)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 overflow-hidden",
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <item.icon className={cn("h-5 w-5 relative z-10 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                <span className="relative z-10">{item.label}</span>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-auto"
                  >
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-white/5 p-4 m-4 rounded-2xl bg-white/5">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              AG
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate text-white">Agencia Demo</span>
              <span className="text-xs text-muted-foreground truncate">Pro Plan</span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
          </Button>
        </div>
      </div>
    </aside>
  )
}