import NextAuth, {NextAuthOptions} from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import jwt from 'jsonwebtoken'
import {JWT} from 'next-auth/jwt'
import {HasuraAdapter} from '@skillrecordings/next-auth-hasura-adapter'
import {getAdminSDK} from '../../../lib/api'

export const nextAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  adapter: HasuraAdapter({
    endpoint: process.env.HASURA_PROJECT_ENDPOINT,
    adminSecret: process.env.HASURA_ADMIN_SECRET,
    getAdminSdk: getAdminSDK,
  }),
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encode: async ({secret, token, maxAge}) => {
      const hasura = token && {
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user'],
          'x-hasura-default-role': 'user',
          'x-hasura-role': 'user',
          'x-hasura-user-id': token.id,
        },
      }

      const encodedToken = jwt.sign(
        {
          ...token,
          iat: Date.now() / 1000,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          ...hasura,
        } || '',
        secret,
        {algorithm: 'HS256'},
      )

      return encodedToken
    },
    decode: async (params) => {
      if (!params.token) return null

      const verify = jwt.verify(params.token, params.secret)
      return verify as JWT
    },
  },
  providers: [
    EmailProvider({
      server: {
        service: 'Postmark',
        auth: {
          user: process.env.POSTMARK_KEY,
          pass: process.env.POSTMARK_KEY,
        },
      },
      from: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async session({session, user, token}) {
      const encodedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || '', {
        algorithm: 'HS256',
      })
      // this gives us access to the token in the browser via getSession()
      session.id = token.id
      session.token = encodedToken
      return session
    },
    async jwt({token, profile, account, user}) {
      if (user) {
        token.id = user.id
        token.purchases = user.purchases
      }
      return token
    },
  },
}

export default NextAuth(nextAuthOptions)
