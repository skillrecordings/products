import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
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
    EmailProvider({
      server: {
        service: 'Postmark',
        auth: {
          user: process.env.POSTMARK_KEY,
          pass: process.env.POSTMARK_KEY,
        },
      },
      from: 'team@testingaccessibility.com',
    }),
  ],
  callbacks: {
    async jwt({token, profile, account, user}) {
      // this is only adding github but you could add anything here
      // and it's async, so you could load other stuff as needed as
      // well probably...

      console.log({profile, user, account})
      token.profile = profile
      return token
    },
  },
})
