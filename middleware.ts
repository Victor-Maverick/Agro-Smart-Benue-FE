import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If user is authenticated, allow the request
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if the route requires authentication
        const path = req.nextUrl.pathname
        
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
        ]
        
        // Check if current path is public
        const isPublicRoute = publicRoutes.some(route => 
          path === route || path.startsWith(route + '/')
        )
        
        // Allow access to public routes
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
