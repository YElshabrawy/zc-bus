import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '@/lib/axios';
import { AxiosError } from 'axios';

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'Credentials',
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'jsmith',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                if (!credentials?.email || !credentials?.password) return null;
                try {
                    const res = await axios.post('/user/login/', {
                        email: credentials?.email,
                        password: credentials?.password,
                    });
                    const user = res.data;
                    if (user) {
                        // Any object returned will be saved in `user` property of the JWT
                        return user;
                    } else {
                        // If you return null then an error will be displayed advising the user to check their details.
                        return null;

                        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                    }
                } catch (e) {
                    const error = e as AxiosError<{
                        non_field_errors: string[];
                        detail?: string;
                    }>;
                    if (error.response?.status === 400) {
                        // Return null if user data could not be retrieved
                        throw new Error(
                            error.response?.data?.non_field_errors[0]
                        );
                    } else if (error.response?.status === 401) {
                        throw new Error(error.response?.data?.detail);
                    } else {
                        throw new Error('An error occurred');
                    }
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token as any;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
