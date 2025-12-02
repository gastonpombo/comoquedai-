import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
// BORRAMOS la importación de Sidebar aquí para que no salga en el Login
import { CreditsProvider } from "@/contexts/credits-context"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ImageAI - Generación de Imágenes",
  description: "Plataforma SaaS de IA",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}>
        {/* Proveedor de Créditos Global (Lógica) */}
        <CreditsProvider>
          
          {/* Renderizamos los hijos DIRECTAMENTE, sin Sidebar forzada */}
          {children}
          
          {/* Notificaciones Globales */}
          <Toaster />
          <Analytics />
        </CreditsProvider>
      </body>
    </html>
  )
}