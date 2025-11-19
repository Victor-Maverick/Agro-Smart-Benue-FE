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
                    console.error('[NextAuth] Missing credentials');
                    return null;
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
                        timeout: 10000, // 10 second timeout
                    });

                    console.log('[NextAuth] Login response status:', response.status);
                    console.log('[NextAuth] Login response data:', JSON.stringify(response.data));

                    if (response.data.status === true && response.data.data) {
                        const loginData = response.data.data;
                        
                        if (loginData.token) {
                            console.log('[NextAuth] Login successful for:', loginData.email);
                            console.log('[NextAuth] User roles:', loginData.roles);
                            
                            const user = {
                                id: loginData.email,
                                email: loginData.email,
                                accessToken: loginData.token,
                                roles: loginData.roles || [],
                                firstName: loginData.firstName || '',
                                lastName: loginData.lastName || '',
                                mediaUrl: loginData.mediaUrl || null,
                            };
                            
                            console.log('[NextAuth] Returning user object:', JSON.stringify(user));
                            return user;
                        }
                    }
                    
                    console.error('[NextAuth] Invalid response structure:', response.data);
                    return null;
                } catch (error) {
                    console.error('[NextAuth] Authorize error:', error);
                    if (axios.isAxiosError(error)) {
                        console.error('[NextAuth] Response data:', error.response?.data);
                        console.error('[NextAuth] Response status:', error.response?.status);
                        console.error('[NextAuth] Request URL:', error.config?.url);
                    }
                    return null;
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
                console.log('[NextAuth] JWT callback - token created:', JSON.stringify(token));
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                console.log('[NextAuth] Session callback - token:', JSON.stringify(token));
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.accessToken = token.accessToken as string;
                session.user.roles = token.roles as string[];
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.mediaUrl = token.mediaUrl as string | null;
                console.log('[NextAuth] Session callback - session created:', JSON.stringify(session));
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
