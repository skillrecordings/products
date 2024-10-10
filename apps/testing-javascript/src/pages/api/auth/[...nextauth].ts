import NextAuth, {type CookiesOptions, NextAuthOptions, Theme} from 'next-auth'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'
import Github from 'next-auth/providers/github'
import Discord from 'next-auth/providers/discord'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#F59E0B',
}

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL

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
  providers,
  cookies,
})

export default async function NextAuthEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return NextAuth(
    req,
    res,
    createOptions({req, theme: productTheme, providers, cookies}),
  )
}

export const config = {
  api: {
    externalResolver: true,
  },
}
