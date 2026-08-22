import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  // Redirect /login to /admin if already logged in
  if (request.nextUrl.pathname === '/login' && request.cookies.has('siv-jwt'))
    return NextResponse.redirect(new URL('/admin', request.url))
}

export const config = { matcher: ['/login'] }
