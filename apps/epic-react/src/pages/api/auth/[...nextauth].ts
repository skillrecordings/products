import NextAuth, {NextAuthOptions, Theme, type CookiesOptions} from 'next-auth'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'

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

export const nextAuthOptions: NextAuthOptions = createOptions({
  theme: productTheme,
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
      cookies,
    }),
  )
}
export const config = {
  api: {
    externalResolver: true,
  },
}
