"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

interface CreditsContextType {
  credits: number | null
  loading: boolean
  userId: string | null
  refreshCredits: () => Promise<void>
  deductCredits: (amount: number) => void
  addCredits: (amount: number) => void
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  
  // Usamos useState para estabilizar el cliente
  const [supabase] = useState(() => createClient())

  const fetchCredits = useCallback(async (uid: string) => {
    console.log("💰 [Credits] Buscando créditos para:", uid)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", uid)
        .single()

      if (error) {
        console.error("❌ [Credits] Error al leer DB:", error.message)
      }

      if (data) {
        console.log("✅ [Credits] Encontrados:", data.credits)
        setCredits(data.credits)
      } else {
        console.warn("⚠️ [Credits] Usuario sin perfil en DB")
      }
    } catch (error) {
      console.error("❌ [Credits] Error fatal fetching:", error)
    }
  }, [supabase])

  const refreshCredits = useCallback(async () => {
    // console.log("🔄 [Credits] Verificando sesión...")
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // CAMBIO: Si el error es que falta la sesión, lo ignoramos (es normal si no estás logueado)
    if (error && !error.message.includes("Auth session missing")) {
        console.error("❌ [Auth] Error inesperado:", error.message)
    }

    if (user) {
      // console.log("👤 [Auth] Usuario:", user.email)
      setUserId(user.id)
      await fetchCredits(user.id)
    } else {
      // Si no hay usuario, limpiamos todo silenciosamente
      setUserId(null)
      setCredits(null)
    }
    setLoading(false)
  }, [supabase, fetchCredits])
  
  const deductCredits = useCallback((amount: number) => {
      setCredits((prev) => (prev !== null ? prev - amount : null))
    }, [])

  const addCredits = useCallback((amount: number) => {
    setCredits((prev) => (prev !== null ? prev + amount : amount))
  }, [])

  useEffect(() => {
    console.log("🏁 [Init] Montando CreditsProvider")
    refreshCredits()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("📢 [Evento Auth]:", event)
      
      if (session?.user) {
        console.log("👤 [Evento Auth] Sesión válida para:", session.user.email)
        setUserId(session.user.id)
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
             await fetchCredits(session.user.id)
        }
        setLoading(false)
      } else {
        console.log("👋 [Evento Auth] Sin sesión (Logout o Error)")
        // Solo borramos si el evento es explícitamente de salida
        if (event === 'SIGNED_OUT') {
            setCredits(null)
            setUserId(null)
        }
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, refreshCredits, fetchCredits])

  return (
    <CreditsContext.Provider value={{ credits, loading, userId, refreshCredits, deductCredits, addCredits }}>
      {children}
    </CreditsContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditsContext)
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider")
  }
  return context
}