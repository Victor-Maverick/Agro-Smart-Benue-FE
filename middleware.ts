// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

interface CustomToken {
    id?: string;
    email?: string;
    accessToken?: string;
    roles?: string[];
    exp?: number;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect admin routes
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as CustomToken | null;

    // Redirect to login if not authenticated
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check if the user has at least one role (allow if no roles defined for backward compatibility)
    if (token.roles && token.roles.length === 0) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Only ADMIN and SUPER_ADMIN can access admin routes
    const hasAdminRole = token.roles?.some(role => 
        role === 'ADMIN' || role === 'SUPER_ADMIN'
    );

    if (!hasAdminRole) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
};
