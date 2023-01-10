import NextAuth, {NextAuthOptions, Theme} from 'next-auth'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#4537D2',
}

export const nextAuthOptions: NextAuthOptions = createOptions({
  theme: productTheme,
})

export default async function NextAuthEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return withSentry(
    NextAuth(req, res, createOptions({req, theme: productTheme})),
  )
}

export const config = {
  api: {
    externalResolver: true,
  },
}
