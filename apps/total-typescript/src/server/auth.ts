import {getServerSession, type Theme} from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import {prisma} from '@skillrecordings/database'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#10172a',
  logo: 'https://res.cloudinary.com/total-typescript/image/upload/v1669818423/illustrations/email_txtv7q.png',
}

const providers = [
  GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
]

export const getServerAuthSession = () =>
  getServerSession({
    theme: productTheme,
    providers,
    callbacks: {
      session: async ({session}) => {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: session?.user?.email || undefined,
          },
        })
        const role = dbUser?.roles || 'user'
        return {
          ...session,
          user: {
            ...session.user,
            id: dbUser?.id,
            role,
          },
        }
      },
    },
  })
