import { type NextRequest } from 'next/server'
// Fíjate que importamos desde la carpeta 'supabase' donde está el cerebro
import { updateSession } from '@/lib/supabase/middleware' 

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}