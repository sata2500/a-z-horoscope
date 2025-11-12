import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
        // Type assertion for extended user fields from Prisma
        const extendedUser = user as typeof user & {
          role?: string;
          birthDate?: Date | null;
          zodiacSign?: string | null;
          createdAt?: Date;
        }
        session.user.role = (extendedUser.role as 'USER' | 'ADMIN') || 'USER'
        session.user.birthDate = extendedUser.birthDate ?? null
        session.user.zodiacSign = extendedUser.zodiacSign ?? null
        session.user.createdAt = extendedUser.createdAt ?? new Date()
      }
      return session
    },
  },
  trustHost: true,
})
