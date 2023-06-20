import NextAuth, {NextAuthOptions, Theme} from 'next-auth'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'
import GitHubProvider from 'next-auth/providers/github'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#F59E0B',
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
  providers,
})

export default async function NextAuthEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  withSentry(
    NextAuth(
      req,
      res,
      createOptions({
        req,
        theme: productTheme,
        providers,
      }),
    ),
  )
}

export const config = {
  api: {
    externalResolver: true,
  },
}
