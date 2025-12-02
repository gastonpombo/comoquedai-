import { CreditsBadge } from "@/components/credits-badge"

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Bienvenido a tu panel de control</p>
      </div>
      <CreditsBadge />
    </header>
  )
}
