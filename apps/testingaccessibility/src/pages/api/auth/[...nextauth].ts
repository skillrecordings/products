import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import prisma from 'db/index'

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    EmailProvider({
      server: {
        service: 'Postmark',
        auth: {
          user: process.env.POSTMARK_KEY,
          pass: process.env.POSTMARK_KEY,
        },
      },
      from: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
})
