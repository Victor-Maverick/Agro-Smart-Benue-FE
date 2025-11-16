// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect admin routes
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Check if user has auth token in cookies
    const authToken = req.cookies.get('authToken')?.value;

    // Redirect to login if not authenticated
    if (!authToken) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // For now, allow access if authenticated
    // Role-based checks can be added by decoding the token if needed
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/dashboard/:path*',
    ],
};
