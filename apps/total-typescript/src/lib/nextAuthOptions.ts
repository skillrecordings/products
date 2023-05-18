import {createOptions} from '@skillrecordings/skill-api'
import {Theme, type NextAuthOptions} from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

export const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#10172a',
  logo: 'https://res.cloudinary.com/total-typescript/image/upload/v1669818423/illustrations/email_txtv7q.png',
}

export const providers = [
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
