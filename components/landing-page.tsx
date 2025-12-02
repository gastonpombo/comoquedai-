"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Check, ArrowRight, Zap, Shield, Globe } from "lucide-react"
import { motion } from "framer-motion"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/50">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">ImageAI</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-white/5">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                Empezar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                La nueva era del marketing digital
              </span>
              <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50">
                Genera imágenes con <br />
                <span className="text-gradient">Inteligencia Artificial</span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Potencia tu agencia con assets visuales generados en segundos.
                Calidad de estudio, escalabilidad infinita y control total sobre tu marca.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-105">
                    Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105">
                    Ver Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-black/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Todo lo que necesitas</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Herramientas diseñadas específicamente para agencias que necesitan velocidad y calidad.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Generación Instantánea",
                  desc: "Crea cientos de variantes en segundos. Olvida los cuellos de botella creativos."
                },
                {
                  icon: Shield,
                  title: "Seguridad Empresarial",
                  desc: "Tus datos y assets están protegidos con encriptación de grado militar."
                },
                {
                  icon: Globe,
                  title: "Escalabilidad Global",
                  desc: "Infraestructura distribuida para garantizar disponibilidad 99.9%."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors hover:bg-white/10"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 text-center backdrop-blur-md">
              <h2 className="text-4xl font-bold mb-6">¿Listo para escalar tu agencia?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Únete a las agencias líderes que ya están revolucionando su flujo de trabajo.
              </p>
              <Link href="/login">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-black hover:bg-white/90 shadow-xl transition-transform hover:scale-105">
                  Obtener Acceso Anticipado
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <span className="font-semibold text-muted-foreground">ImageAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 ImageAI Platform. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}