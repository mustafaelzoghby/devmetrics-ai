import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email repo" } },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      if (account?.access_token) {
        token.githubToken = account.access_token
        // Update GitHub token in DB
        await prisma.user.update({
          where: { id: user!.id! },
          data: { githubToken: account.access_token },
        }).catch(() => {})
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).githubToken = token.githubToken
      }
      return session
    },
  },
  pages: { signIn: "/login" },
})
