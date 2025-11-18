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
                    console.error('Missing credentials');
                    return null;
                }

                try {
                    const loginUrl = getApiUrl('/api/auth/login');
                    console.log('Attempting login for:', credentials.email);
                    console.log('Login URL:', loginUrl);
                    
                    const response = await axios.post(loginUrl, {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    console.log('Login response status:', response.status);
                    console.log('Login response data:', response.data);

                    if (response.data.status === true && response.data.data) {
                        const loginData = response.data.data;
                        
                        if (loginData.token) {
                            console.log('Login successful for:', loginData.email);
                            return {
                                id: loginData.email,
                                email: loginData.email,
                                accessToken: loginData.token,
                                roles: loginData.roles || [],
                                firstName: loginData.firstName || '',
                                lastName: loginData.lastName || '',
                                mediaUrl: loginData.mediaUrl || null,
                            };
                        }
                    }
                    
                    console.error('Invalid response structure:', response.data);
                    return null;
                } catch (error) {
                    console.error('Authorize error details:', error);
                    if (axios.isAxiosError(error)) {
                        console.error('Response data:', error.response?.data);
                        console.error('Response status:', error.response?.status);
                    }
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.accessToken = user.accessToken;
                token.roles = user.roles;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.mediaUrl = user.mediaUrl;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.accessToken = token.accessToken as string;
                session.user.roles = token.roles as string[];
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.mediaUrl = token.mediaUrl as string | null;
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
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 1 day in seconds (86400 seconds)
    },
    jwt: {
        maxAge: 24 * 60 * 60, // 1 day in seconds
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
