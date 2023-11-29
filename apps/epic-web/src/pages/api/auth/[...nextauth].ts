import NextAuth, {
  type CookiesOptions,
  type NextAuthOptions,
  type Theme,
} from 'next-auth'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'
import GitHubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'

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

export const nextAuthOptions: NextAuthOptions = createOptions({
  theme: productTheme,
  providers,
  cookies,
})

export default async function NextAuthEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  NextAuth(
    req,
    res,
    createOptions({
      req,
      theme: productTheme,
      providers,
      cookies,
    }),
  )
}
