"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, ImageIcon, CreditCard, Sparkles, LogOut, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

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
    try {
      setIsLoggingOut(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      router.refresh()
      router.replace("/") // Al salir vamos a la Landing
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Sparkles className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">ImageAI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = currentView === item.view
            return (
              <button
                key={item.view}
                onClick={() => onNavigate?.(item.view)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
          </Button>
          <p className="mt-4 text-xs text-sidebar-foreground/50">© 2025 ImageAI Platform</p>
        </div>
      </div>
    </aside>
  )
}