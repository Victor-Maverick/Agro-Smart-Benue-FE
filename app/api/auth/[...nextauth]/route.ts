import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { getApiUrl } from '@/lib/config';

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                try {
                    const loginUrl = getApiUrl('/api/auth/login');
                    console.log('[NextAuth] Attempting login for:', credentials.email);
                    console.log('[NextAuth] Login URL:', loginUrl);
                    
                    const response = await axios.post(loginUrl, {
                        email: credentials.email,
                        password: credentials.password,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000,
                    });

                    console.log('[NextAuth] Login response status:', response.status);
                    console.log('[NextAuth] Login response data:', JSON.stringify(response.data));

                    const loginData = response.data.data;

                    if (loginData && loginData.token) {
                        console.log('[NextAuth] Login successful for:', loginData.email);
                        console.log('[NextAuth] User roles:', loginData.roles);
                        
                        return {
                            id: loginData.id || loginData.email || credentials.email,
                            email: loginData.email || credentials.email,
                            accessToken: loginData.token,
                            roles: loginData.roles || [],
                            firstName: loginData.firstName || '',
                            lastName: loginData.lastName || '',
                            mediaUrl: loginData.mediaUrl || null,
                        };
                    }
                    
                    throw new Error('Invalid login response from server');
                } catch (error) {
                    console.error('[NextAuth] Authorize error:', error);
                    if (axios.isAxiosError(error)) {
                        const errorMessage = error.response?.data?.message || 
                                           error.response?.data?.error || 
                                           'Invalid email or password';
                        console.error('[NextAuth] Error message:', errorMessage);
                        throw new Error(errorMessage);
                    }
                    throw new Error('An unexpected error occurred');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log('[NextAuth] JWT callback - user data:', JSON.stringify(user));
                token.id = user.id;
                token.email = user.email;
                token.accessToken = user.accessToken;
                token.roles = user.roles;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.mediaUrl = user.mediaUrl;
                console.log('[NextAuth] JWT callback - token created with roles:', token.roles);
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                console.log('[NextAuth] Session callback - building session from token');
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.accessToken = token.accessToken as string;
                session.user.roles = token.roles as string[];
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.mediaUrl = token.mediaUrl as string | null;
                console.log('[NextAuth] Session callback - session created with roles:', session.user.roles);
            }
            return session;
        },
    },
    events: {
        async signOut({ token }) {
            // Call logout API when user signs out
            try {
                const logoutUrl = getApiUrl('/api/auth/logout');
                await axios.post(logoutUrl, {}, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production' 
                ? '__Secure-next-auth.session-token'
                : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 1 day in seconds (86400 seconds)
    },
    jwt: {
        maxAge: 24 * 60 * 60, // 1 day in seconds
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // Enable debug logs to troubleshoot production issues
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
