import {type CookiesOptions, getServerSession, type Theme} from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'
import {prisma} from '@skillrecordings/database'

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL

const productTheme: Theme = {
  colorScheme: 'light',
  brandColor: '#5277FF',
  logo: 'https://res.cloudinary.com/epic-web/image/upload/v1697357154/logo-email.png',
}

const providers = [
  GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
  DiscordProvider({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
]

const cookies: Partial<CookiesOptions> = {
  sessionToken: {
    name: `${VERCEL_DEPLOYMENT ? '__Secure-' : ''}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'none', // 'lax',
      path: '/',
      secure: true,
    },
  },
  callbackUrl: {
    name: `${VERCEL_DEPLOYMENT ? '__Secure-' : ''}next-auth.callback-url`,
    options: {
      sameSite: 'none', // 'lax',
      path: '/',
      secure: true,
    },
  },
  csrfToken: {
    name: `${VERCEL_DEPLOYMENT ? '__Host-' : ''}next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: 'none', // 'lax',
      path: '/',
      secure: true,
    },
  },
}

export const getServerAuthSession = () =>
  getServerSession({
    theme: productTheme,
    providers,
    cookies,
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
