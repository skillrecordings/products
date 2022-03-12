import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import jwt from 'jsonwebtoken'
import {JWT} from 'next-auth/jwt'
import {isEmpty} from 'lodash'

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
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
              'x-hasura-default-role': 'admin',
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

        /**
         * query the database to see if a user with the above token.id
         * already exists in the database. if they do not exist we will
         * make a second call adding them.
         */
        const isNewUser = await fetch(
          process.env.HASURA_GRAPHQL_ENDPOINT || '',
          {
            method: 'POST',
            body: JSON.stringify({
              query: `query loadUser($user: String) {
              users(where: {id: {_eq: $user}}) {
                email
              }
            
            }`,
              variables: {user: token.id},
            }),
            headers: {
              'content-type': 'application/json',
              'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET || '',
            },
          },
        )
          .then((response) => response.json())
          .then(({data}) => isEmpty(data))

        if (isNewUser) {
          /**
           * inserts the user into the database, but if we aren't
           * logging in with github there are a several values
           * that we won't have yet and can ask later
           */
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

          /**
           * send the above mutation query to insert the new user into
           * the database
           */
          await fetch(process.env.HASURA_GRAPHQL_ENDPOINT || '', {
            method: 'POST',
            body: query,
            headers: {
              'content-type': 'application/json',
              'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET || '',
            },
          })
        }
      }

      return token
    },
  },
})
