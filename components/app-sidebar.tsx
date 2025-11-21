"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Banana, Home, History, Settings, CreditCard, LogOut } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Sidebar className="border-r-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-sidebar-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Banana className="h-5 w-5" />
          </div>
          <span>Nano Banana Pro</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/"}
              className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/history"}
              className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Link href="/history">
                <History className="mr-2 h-4 w-4" />
                <span>History</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/billing"}
              className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Link href="/billing">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/settings"}
              className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-9 w-9 border border-sidebar-border">
            <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.user_metadata?.full_name || "User"}
            </span>
            <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
