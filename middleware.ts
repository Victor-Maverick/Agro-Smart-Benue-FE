import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/verify-email',
    '/market',
    '/market-prices',
    '/crop-tips',
    '/events',
    '/unauthorized',
  ]

  // Check if the current path is a public route or starts with a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Allow public routes and API routes
  if (isPublicRoute || pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if token is expired (24 hours)
  const tokenAge = Date.now() - (token.iat as number) * 1000
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  
  if (tokenAge > maxAge) {
    // Token expired, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const roles = (token.roles as string[]) || []
  const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER_ADMIN')

  // Admin routes - only accessible by admins
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    return NextResponse.next()
  }

  // Dashboard routes - accessible by authenticated users
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*|sw.js|manifest.json).*)',
  ],
}
