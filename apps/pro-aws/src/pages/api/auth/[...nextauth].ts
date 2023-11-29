import NextAuth, {NextAuthOptions, Theme} from 'next-auth'
import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'

import GitHubProvider from 'next-auth/providers/github'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#F59E0B',
  logo: 'https://res.cloudinary.com/dnwi9abmc/image/upload/dpr_auto,f_auto,q_auto/v1701125707/proawsdev-badge_2x_wj57ri.png',
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
  NextAuth(req, res, createOptions({req, theme: productTheme, providers}))
}
