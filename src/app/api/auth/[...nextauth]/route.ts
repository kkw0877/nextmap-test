import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/db"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt" as const,
        maxAge: 60 * 60 * 24,
        updateAge: 60 * 60 * 2,
    },
    adapter: PrismaAdapter(prisma),
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    pages: {
        signIn: '/users/login',
    },
    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
        }),
        jwt: async ({ user, token }) => {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }