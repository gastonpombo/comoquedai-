import { CreditsBadge } from "@/components/credits-badge"

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-xl transition-all duration-300">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Bienvenido a tu panel de control</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />
        <CreditsBadge />
      </div>
    </header>
  )
}
