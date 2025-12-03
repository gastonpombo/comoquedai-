"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, ImageIcon, CreditCard, Sparkles, LogOut, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "mis-generaciones", label: "Mis Generaciones", icon: ImageIcon },
  { view: "comprar-creditos", label: "Comprar Créditos", icon: CreditCard },
]

interface SidebarProps {
  onLogout?: () => void
  currentView?: string
  onNavigate?: (view: string) => void
  userEmail?: string
  userTier?: string
}

export function Sidebar({ currentView = "dashboard", onNavigate, userEmail, userTier = "Free" }: SidebarProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error logout", error)
    } finally {
      window.location.href = "/"
    }
  }

  const initials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "U"
  const displayName = userEmail ? userEmail.split('@')[0] : "Usuario"

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-300">

      {/* Header Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground">ImageAI</span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.view
          return (
            <button
              key={item.view}
              onClick={() => onNavigate?.(item.view)}
              className={cn(
                "flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer de Usuario */}
      <div className="border-t border-sidebar-border p-4 shrink-0 bg-sidebar-accent/30">

        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-10 w-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center border border-sidebar-primary/20 text-sidebar-primary font-bold text-sm">
            {initials}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-sidebar-foreground truncate w-32" title={userEmail}>
              {displayName}
            </span>
            <span className="text-xs text-sidebar-foreground/60 capitalize">
              {userTier || "Free"} Plan
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive rounded-full"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
        </Button>
      </div>
    </aside>
  )
}