import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Check } from "lucide-react"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      {/* Header Simple */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">ImageAI</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/login">
            <Button>Empezar Gratis</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            Genera imágenes con <span className="text-primary">Inteligencia Artificial</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400">
            Crea assets profesionales, logos y arte conceptual en segundos utilizando nuestros workflows optimizados.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-lg">
                Probar Ahora
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid (Ejemplo) */}
        <section className="py-16 bg-zinc-900/50">
          <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
            {[
              "Modelos de última generación",
              "Sin configuraciones complejas",
              "API disponible"
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">{feature}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="py-8 text-center text-zinc-600 text-sm border-t border-zinc-800">
        © 2025 ImageAI. Todos los derechos reservados.
      </footer>
    </div>
  )
}