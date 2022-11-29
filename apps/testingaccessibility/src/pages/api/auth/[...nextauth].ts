import NextAuth, {NextAuthOptions, Theme} from 'next-auth'
import {withSentry} from '@sentry/nextjs'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#218345',
  logo: 'https://res.cloudinary.com/testing-accessibility/image/upload/v1655584147/logo-email_2x_e0n8tn.png',
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
