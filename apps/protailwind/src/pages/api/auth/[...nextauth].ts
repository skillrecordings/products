import NextAuth, {NextAuthOptions, Theme} from 'next-auth'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#0EA5E9',
  logo: 'https://res.cloudinary.com/pro-tailwind/image/upload/v1667496567/logo_kjq6v1.png',
}

export const nextAuthOptions: NextAuthOptions = createOptions({
  theme: productTheme,
})

export default async function NextAuthEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return NextAuth(req, res, createOptions({req, theme: productTheme}))
}

export const config = {
  api: {
    externalResolver: true,
  },
}
