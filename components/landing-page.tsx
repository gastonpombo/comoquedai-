"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Check, ArrowRight, Zap, Shield, Globe } from "lucide-react"
import { motion } from "framer-motion"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Background Gradients - Lighter & Cleaner */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between" aria-label="Navegación principal">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">ImageAI</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full px-6">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-full px-8">
                Empezar Gratis
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 lg:pt-52 lg:pb-32 overflow-hidden" aria-labelledby="hero-heading">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary mb-8">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                La nueva era del marketing digital con IA
              </span>
              <h1 id="hero-heading" className="mb-8 text-6xl font-extrabold tracking-tight sm:text-8xl text-foreground">
                Generador de Imágenes con{" "}
                <span className="text-primary">Inteligencia Artificial</span> para Agencias
              </h1>
              <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground leading-relaxed">
                Crea imágenes profesionales con IA en segundos. Plataforma SaaS diseñada para agencias de marketing digital.
                10 créditos gratis para comenzar. Calidad de estudio, escalabilidad infinita y control total sobre tu marca.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login">
                  <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-105">
                    Comenzar Ahora Gratis <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-full border-border bg-background hover:bg-muted/50 transition-all hover:scale-105 text-foreground">
                    Ver Características
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 bg-muted/30" aria-labelledby="features-heading">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 id="features-heading" className="text-4xl font-bold mb-6 text-foreground">
                Herramientas de IA para Agencias Creativas
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Generación automática de imágenes con inteligencia artificial. Diseñado específicamente para agencias de marketing que necesitan velocidad, calidad y escalabilidad.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: Zap,
                  title: "Generación Instantánea de Imágenes con IA",
                  desc: "Crea cientos de variantes de imágenes en segundos con nuestro generador de IA. Elimina los cuellos de botella creativos y acelera tu producción de contenido visual para campañas de marketing digital."
                },
                {
                  icon: Shield,
                  title: "Seguridad Empresarial y Privacidad",
                  desc: "Tus datos, prompts y assets visuales están protegidos con encriptación de grado militar. Cumplimiento GDPR y SOC 2 para agencias que manejan información sensible de clientes."
                },
                {
                  icon: Globe,
                  title: "Escalabilidad Global e Infraestructura Cloud",
                  desc: "Infraestructura distribuida en múltiples regiones para garantizar disponibilidad 99.9%. Genera miles de imágenes simultáneamente sin límites de capacidad para tus campañas más grandes."
                }
              ].map((feature, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-10 rounded-[2.5rem] bg-background border border-border hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-2xl mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.desc}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden" aria-labelledby="cta-heading">
          <div className="container mx-auto px-6 relative">
            <div className="max-w-5xl mx-auto p-16 rounded-[3rem] bg-primary text-primary-foreground text-center shadow-2xl shadow-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" aria-hidden="true" />
              <div className="relative z-10">
                <h2 id="cta-heading" className="text-5xl font-bold mb-8">
                  ¿Listo para Escalar tu Agencia con IA?
                </h2>
                <p className="text-2xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
                  Únete a las agencias líderes que ya están revolucionando su flujo de trabajo con generación automática de imágenes. Comienza gratis hoy.
                </p>
                <Link href="/login">
                  <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-background text-foreground hover:bg-background/90 shadow-xl transition-transform hover:scale-105 border-0">
                    Obtener 10 Créditos Gratis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-foreground text-lg">ImageAI - Generador de Imágenes con IA</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 ImageAI Platform. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}