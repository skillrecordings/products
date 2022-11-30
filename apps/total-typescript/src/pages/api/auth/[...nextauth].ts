import NextAuth, {type NextAuthOptions, Theme} from 'next-auth'
import {withSentry} from '@sentry/nextjs'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#10172a',
  logo: 'https://res.cloudinary.com/total-typescript/image/upload/v1669818423/illustrations/email_txtv7q.png',
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
