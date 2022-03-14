import {Adapter} from 'next-auth/adapters'
import {GraphQLClient, gql} from 'graphql-request'

type HasuraAdapterOptions = {
  endpoint: string
  adminSecret: string
}

export function HasuraAdapter({
  endpoint,
  adminSecret,
}: HasuraAdapterOptions): Adapter {
  const client = new GraphQLClient(endpoint, {
    headers: {
      'X-Hasura-Admin-Secret': adminSecret,
    },
  })

  return {
    async createUser(data) {
      const query = gql`
        mutation CreateUser($data: users_insert_input!) {
          insert_users_one(object: $data) {
            email
            emailVerified
            id
            name
            image
          }
        }
      `

      const {insert_users_one: user} = await client.request(query, {data})

      if (!user) {
        return null
      }

      return user
    },
    async getUser(id: string) {
      const query = gql`
        query loadUser($id: uuid!) {
          users_by_pk(id: $id) {
            id
            name
            email
            image
          }
        }
      `
      const {users_by_pk: user} = await client.request(query, {id})

      if (!user) {
        return null
      }

      return user
    },
    async getUserByEmail(email) {
      const query = gql`
        query loadUserByEmail($email: String) {
          users(where: {email: {_eq: $email}}) {
            id
            name
            email
            image
          }
        }
      `

      const {users} = await client.request(query, {email})

      const user = users?.[0]

      if (!user) {
        return null
      }

      return user
    },
    async getUserByAccount({providerAccountId, provider}) {
      const query = gql`
        query loadUserForAccount(
          $providerAccountId: String
          $provider: String
        ) {
          accounts(
            where: {
              providerAccountId: {_eq: $providerAccountId}
              provider: {_eq: $provider}
            }
          ) {
            user {
              image
              id
              name
              email
            }
          }
        }
      `

      const {accounts} = await client.request(query, {
        providerAccountId,
        provider,
      })

      const account = accounts?.[0]

      if (!account || !account.user) {
        return null
      }

      return account.user
    },
    async updateUser(data) {
      const query = gql`
        mutation UpdateUser($id: uuid!, $data: users_set_input!) {
          update_users_by_pk(_set: $data, pk_columns: {id: $id}) {
            email
            emailVerified
            id
            image
            name
          }
        }
      `

      const {update_users_by_pk: user} = await client.request(query, {
        id: data.id,
        data,
      })

      if (!user) {
        return null
      }

      return user
    },
    async deleteUser(userId) {
      // not implemented
    },
    async linkAccount(data) {
      const mutation = gql`
        mutation linkAccount($data: accounts_insert_input!) {
          insert_accounts_one(object: $data) {
            id
            access_token
            expires_at
            provider
            providerAccountId
            refresh_token
            refresh_token_expires_in
            scope
            session_state
            token_type
            type
            userId
          }
        }
      `

      const {insert_accounts_one: account} = await client.request(mutation, {
        data,
      })

      return account
    },
    async unlinkAccount({providerAccountId, provider}) {
      //not implemented
    },
    async createSession(data) {
      const mutation = gql`
        mutation ($data: sessions_insert_input!) {
          insert_sessions_one(object: $data) {
            expires
            id
            sessionToken
            userId
          }
        }
      `

      const {insert_sessions_one: session} = await client.request(mutation, {
        data,
      })

      if (!session) {
        return null
      }

      return {
        ...session,
        expires: new Date(session.expires * 1000),
      }
    },
    async getSessionAndUser(sessionToken) {
      const query = gql`
        query loadSessionAndUser($sessionToken: String) {
          sessions(where: {sessionToken: {_eq: $sessionToken}}) {
            sessionToken
            id
            expires
            userId
            user {
              id
              name
              image
              email
            }
          }
        }
      `

      const {sessions} = await client.request(query, {sessionToken})

      if (!sessions?.[0]) {
        return null
      }

      const {user, ...session}: any = sessions?.[0]

      return {
        user,
        session: {
          ...session,
          expires: new Date(session.expires),
        },
      }
    },
    async updateSession(data) {
      const query = gql`
        mutation UpdateSession(
          $sessionToken: String
          $data: sessions_set_input!
        ) {
          update_sessions(
            where: {sessionToken: {_eq: $sessionToken}}
            _set: $data
          ) {
            returning {
              expires
              id
              sessionToken
              userId
            }
          }
        }
      `

      const {update_sessions} = await client.request(query, {
        sessionToken: data.sessionToken,
        data,
      })

      const session = update_sessions?.returning?.[0]

      if (!session) return null

      return {...session, expires: new Date(session.expires)}
    },
    async deleteSession(sessionToken) {
      const query = gql`
        mutation deleteSession($sessionToken: String) {
          delete_sessions(where: {sessionToken: {_eq: $sessionToken}}) {
            returning {
              expires
              id
              sessionToken
              userId
            }
          }
        }
      `

      const {delete_sessions} = await client.request(query, {
        sessionToken,
      })

      const session = delete_sessions?.returning?.[0]
      if (!session) return null

      return {...session, expires: new Date(session.expires)}
    },
    async createVerificationToken(data) {
      const query = gql`
        mutation CreateVerificationToken(
          $data: verification_tokens_insert_input!
        ) {
          insert_verification_tokens_one(object: $data) {
            expires
            identifier
            token
          }
        }
      `

      const {insert_verification_tokens_one: verificationToken} =
        await client.request(query, {
          data,
        })

      if (!verificationToken) {
        return null
      }

      return {
        ...verificationToken,
        expires: new Date(verificationToken.expires),
      }
    },
    async useVerificationToken({identifier, token}) {
      try {
        const query = gql`
          mutation UseVerificationToken($identifier: String!, $token: String!) {
            delete_verification_tokens(
              where: {token: {_eq: $token}, identifier: {_eq: $identifier}}
            ) {
              returning {
                expires
                identifier
                token
              }
            }
          }
        `

        const {delete_verification_tokens: deletedTokens} =
          await client.request(query, {
            identifier,
            token,
          })

        const deletedToken = deletedTokens?.returning?.[0]

        if (!deletedToken) return null

        return {
          ...deletedToken,
          expires: new Date(deletedToken.expires),
        }
      } catch (e) {
        return null
      }
    },
  }
}
