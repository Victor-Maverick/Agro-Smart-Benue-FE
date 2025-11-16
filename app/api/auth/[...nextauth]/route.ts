import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

// Extend NextAuth types
declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            email?: string;
            roles?: string[];
            firstName?: string;
            lastName?: string;
            mediaUrl?: string;
        };
    }

    interface User {
        id?: string;
        email?: string;
        accessToken?: string;
        roles?: string[];
        firstName?: string;
        lastName?: string;
        mediaUrl?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        email?: string;
        accessToken?: string;
        roles?: string[];
        firstName?: string;
        lastName?: string;
        mediaUrl?: string;
    }
}

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
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                    console.log('Attempting login to:', `${apiUrl}/api/auth/login`);

                    const response = await axios.post(`${apiUrl}/api/auth/login`, {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const loginData = response.data.data;
                    console.log('Login response data:', loginData);

                    if (loginData && loginData.token) {
                        return {
                            id: loginData.email || credentials.email,
                            email: loginData.email || credentials.email,
                            accessToken: loginData.token,
                            roles: loginData.roles || [],
                            firstName: loginData.firstName || '',
                            lastName: loginData.lastName || '',
                            mediaUrl: loginData.mediaUrl || '',
                        };
                    }
                    throw new Error('Invalid login response from server');
                } catch (error) {
                    console.error('Authorize error:', error);
                    throw new Error(
                        axios.isAxiosError(error)
                            ? error.response?.data?.message || 'Invalid email or password'
                            : 'An unexpected error occurred'
                    );
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
                session.user.id = token.id;
                session.user.email = token.email;
                session.accessToken = token.accessToken;
                session.user.roles = token.roles;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.mediaUrl = token.mediaUrl;
            }
            return session;
        },
    },
    events: {
        async signOut({ token }) {
            // Call logout API when user signs out
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                await axios.post(`${apiUrl}/api/auth/logout`, {}, {
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
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'production',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };