import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import jwt from 'jsonwebtoken'
import {JWT} from 'next-auth/jwt'

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encode: async ({secret, token, maxAge}) => {
      const encodedToken = jwt.sign(
        {
          ...token,
          iat: Date.now() / 1000,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user'],
            'x-hasura-default-role': 'user',
            'x-hasura-role': 'user',
            'x-hasura-user-id': token?.id,
          },
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
        token.id = `${account?.provider}~${user.id}`

        const query = JSON.stringify({
          query: `mutation {
            insert_users_one(object: {
              id: "${token.id}"
              name: "${user.name}"
              email: "${user.email}"
              image: "${user.image}"
              ${
                account?.provider === 'github'
                  ? `github: "${profile?.login}"`
                  : ''
              }
              ${
                account?.provider === 'github' && profile?.blog
                  ? `blog: "${profile?.blog}"`
                  : ''
              }
              ${
                account?.provider === 'github' && profile?.company
                  ? `company: "${profile?.company}"`
                  : ''
              }
              ${
                account?.provider === 'github' && profile?.twitter_username
                  ? `twitter: "${profile?.twitter_username}"`
                  : ''
              }
             }
            ) { id }
          }
          `,
        })

        await fetch(process.env.HASURA_GRAPHQL_ENDPOINT || '', {
          method: 'POST',
          body: query,
          headers: {
            'content-type': 'application/json',
            'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET || '',
          },
        })
      }

      return token
    },
  },
})
