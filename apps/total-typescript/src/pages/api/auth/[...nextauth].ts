import NextAuth, {type NextAuthOptions, Theme} from 'next-auth'

import {createOptions} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'
import GitHubProvider from 'next-auth/providers/github'

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#10172a',
  logo: 'https://res.cloudinary.com/total-typescript/image/upload/v1669818423/illustrations/email_txtv7q.png',
}

const providers = [
  GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    // GitHub sends an RFC 9207 `iss` callback parameter. openid-client rejects
    // it unless the provider declares the issuer.
    issuer: 'https://github.com/login/oauth',
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
  NextAuth(
    req,
    res,
    createOptions({
      req,
      theme: productTheme,
      providers,
    }),
  )
}
