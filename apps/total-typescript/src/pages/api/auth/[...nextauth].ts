import NextAuth, {type NextAuthOptions, Theme} from 'next-auth'
import {withSentry} from '@sentry/nextjs'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'
import GitHubProvider from 'next-auth/providers/github'
import {productTheme, providers} from 'lib/nextAuthOptions'

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
        providers: providers,
      }),
    ),
  )
}

export const config = {
  api: {
    externalResolver: true,
  },
}
