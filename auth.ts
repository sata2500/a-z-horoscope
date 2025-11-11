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
        // @ts-ignore - Ek alanları ekle
        session.user.role = (user as any).role || 'USER'
        session.user.birthDate = (user as any).birthDate
        session.user.zodiacSign = (user as any).zodiacSign
        session.user.createdAt = (user as any).createdAt
      }
      return session
    },
  },
  trustHost: true,
})
