"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

interface CreditsContextType {
  credits: number
  loading: boolean
  userId: string | null
  refreshCredits: () => Promise<void>
  deductCredits: (amount: number) => void
  addCredits: (amount: number) => void
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: ReactNode }) {
  // CAMBIO: Inicializamos en 0 en lugar de null para evitar bloqueos visuales
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const [supabase] = useState(() => createClient())

  const fetchCredits = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", uid)
        .single()

      if (error) {
        console.warn("No se pudo cargar el perfil (¿Usuario nuevo o borrado?):", error.message)
        // Si no existe, asumimos 0
        setCredits(0)
      } else if (data) {
        setCredits(data.credits)
      }
    } catch (error) {
      console.error("Error crítico fetching credits:", error)
      setCredits(0)
    } finally {
      // SIEMPRE apagamos el loading, pase lo que pase
      setLoading(false)
    }
  }, [supabase])

  const refreshCredits = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      setUserId(user.id)
      await fetchCredits(user.id)
    } else {
      setUserId(null)
      setCredits(0)
      setLoading(false)
    }
  }, [supabase, fetchCredits])

  const deductCredits = useCallback((amount: number) => {
    setCredits((prev) => Math.max(0, prev - amount))
  }, [])

  const addCredits = useCallback((amount: number) => {
    setCredits((prev) => prev + amount)
  }, [])

  useEffect(() => {
    refreshCredits()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await fetchCredits(session.user.id)
        }
      } else if (event === 'SIGNED_OUT') {
        setCredits(0)
        setUserId(null)
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