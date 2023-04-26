import NextAuth, {type NextAuthOptions, Theme} from 'next-auth'
import {withSentry} from '@sentry/nextjs'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'
import GitHubProvider from 'next-auth/providers/github'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#10172a',
}

const providers = [
  GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
]

export const nextAuthOptions: NextAuthOptions = createOptions({
  theme: productTheme,
})

export default async function NextAuthEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return withSentry(
    NextAuth(
      req,
      res,
      createOptions({
        req,
        theme: productTheme,
      }),
    ),
  )
}

export const config = {
  api: {
    externalResolver: true,
  },
}
