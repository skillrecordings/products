import NextAuth, {NextAuthOptions, Theme, type CookiesOptions} from 'next-auth'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'
import Github from 'next-auth/providers/github'
import Discord from 'next-auth/providers/discord'

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#F59E0B',
}

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

const providers = [
  Github({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
  Discord({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true,
    authorization:
      'https://discord.com/api/oauth2/authorize?scope=identify+email+guilds.join+guilds',
  }),
]

export const nextAuthOptions: NextAuthOptions = createOptions({
  theme: productTheme,
  cookies,
  providers,
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
      res,
      skillCookieDomain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      theme: productTheme,
      cookies,
      providers,
    }),
  )
}
export const config = {
  api: {
    externalResolver: true,
  },
}
