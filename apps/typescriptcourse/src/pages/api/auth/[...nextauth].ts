import NextAuth, {type NextAuthOptions, Theme} from 'next-auth'
import {withSentry} from '@sentry/nextjs'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#143582',
  logo: 'https://res.cloudinary.com/skill-recordings-inc/image/upload/v1668043654/android-chrome-512x512_vs9zvc.png',
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
