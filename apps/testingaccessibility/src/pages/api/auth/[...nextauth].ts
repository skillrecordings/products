import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import jwt from 'jsonwebtoken'
import {JWT} from 'next-auth/jwt'
import {HasuraAdapter} from 'utils/next-auth/adapters/hasura-adapter'

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  adapter: HasuraAdapter({
    endpoint: process.env.HASURA_GRAPHQL_ENDPOINT || '',
    adminSecret: process.env.HASURA_ADMIN_SECRET || '',
  }),
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encode: async ({secret, token, maxAge}) => {
      const adminUserIds = (process.env.ADMIN_USER_IDS || '')
        .split(',')
        .map((id) => id.trim())

      let hasura = {}

      if (token) {
        hasura = {
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user'],
            'x-hasura-default-role': 'user',
            'x-hasura-role': 'user',
            'x-hasura-user-id': token.id,
          },
        }

        if (adminUserIds.includes(token.id as string)) {
          hasura = {
            'https://hasura.io/jwt/claims': {
              'x-hasura-allowed-roles': ['user', 'admin'],
              'x-hasura-default-role': 'user',
              'x-hasura-role': 'admin',
              'x-hasura-user-id': token.id,
            },
          }
        }
      }

      const encodedToken = jwt.sign(
        {
          ...token,
          iat: Date.now() / 1000,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          ...hasura,
        } || '',
        secret,
        {algorithm: 'HS512'},
      )

      return encodedToken
    },
    decode: async (params) => {
      const verify = jwt.verify(params.token || '', params.secret)
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
      from: 'team@testingaccessibility.com',
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
      session.id = token.id
      session.token = encodedToken
      return session
    },
    async jwt({token, profile, account, user}) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  debug: true,
})
