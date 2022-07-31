import NextAuth from 'next-auth'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import {prisma} from '@skillrecordings/database'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/acceso',
    verifyRequest: '/confirmar-email',
  },
})
