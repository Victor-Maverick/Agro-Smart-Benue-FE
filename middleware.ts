import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    
    console.log('[Middleware] Path:', path, 'Has token:', !!token)
    
    // If user is authenticated and trying to access login/signup, redirect to dashboard
    if (token && (path === '/login' || path === '/signup')) {
      const roles = (token.roles as string[]) || []
      const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER_ADMIN')
      const redirectUrl = isAdmin ? '/admin' : '/dashboard'
      
      console.log('[Middleware] Authenticated user on login page, redirecting to:', redirectUrl)
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/login',
          '/signup',
          '/forgot-password',
          '/verify-email',
          '/reset-password',
          '/market',
          '/market-prices',
          '/crop-tips',
          '/events',
        ]
        
        // Check if current path is public
        const isPublicRoute = publicRoutes.some(route => 
          path === route || path.startsWith(route + '/')
        )
        
        console.log('[Middleware] Authorized check - Path:', path, 'Is public:', isPublicRoute, 'Has token:', !!token)
        
        // Allow access to public routes (including login for unauthenticated users)
        if (isPublicRoute) {
          return true
        }
        
        // For protected routes, require valid token
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api/auth).*)',
  ],
}
