import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
// BORRAMOS la importación de Sidebar aquí para que no salga en el Login
import { CreditsProvider } from "@/contexts/credits-context"
import { Toaster } from "@/components/ui/sonner"
import { StructuredData } from "@/components/structured-data"

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ImageAI - Generador de Imágenes con IA para Agencias | Creación Instantánea",
  description: "Genera imágenes profesionales con Inteligencia Artificial en segundos. Plataforma SaaS para agencias de marketing. 100+ créditos gratis. Calidad de estudio, escalabilidad infinita.",
  keywords: ["generador imágenes ia", "inteligencia artificial", "marketing digital", "agencias creativas", "generación imágenes automática", "ia para marketing", "herramientas marketing digital"],
  authors: [{ name: "ImageAI" }],
  creator: "ImageAI",
  publisher: "ShopShop Market",
  metadataBase: new URL('https://shopshop.market'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://shopshop.market/',
    title: 'ImageAI - Generador de Imágenes con IA para Agencias',
    description: 'Genera imágenes profesionales con Inteligencia Artificial en segundos. Plataforma SaaS para agencias de marketing. 100+ créditos gratis.',
    siteName: 'ImageAI',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'ImageAI - Generador de Imágenes con IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImageAI - Generador de Imágenes con IA para Agencias',
    description: 'Genera imágenes profesionales con IA en segundos. 100+ créditos gratis para agencias de marketing.',
    images: ['/twitter-image.png'],
    creator: '@imageai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Usuario debe reemplazar con su código
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${plusJakartaSans.variable} ${geistMono.variable} antialiased`}>
        {/* Structured Data for SEO */}
        <StructuredData />

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