import {Adapter, VerificationToken} from 'next-auth/adapters'
import {first, isEmpty} from 'lodash'

async function makeQuery(query: string) {
  return await fetch(process.env.HASURA_GRAPHQL_ENDPOINT || '', {
    method: 'POST',
    body: query,
    headers: {
      'content-type': 'application/json',
      'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET || '',
    },
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(JSON.stringify(response))
      return response.data
    })
}

export function HasuraAdapter(): Adapter {
  return {
    async createUser(user) {
      console.log('createUser', {user})
      const query = JSON.stringify({
        query: `mutation {
            insert_users_one(object: {
              name: "${user.name}"
              email: "${user.email}"
              image: "${user.image}"
             }
            ) { 
              id
              name
              email 
              image
            }
          }
          `,
      })

      const {insert_users_one} = await makeQuery(query)

      return insert_users_one
    },
    async getUser(id: string) {
      console.log('getUser', {id})
      const query = JSON.stringify({
        query: `query loadUser($user: String) {
              users(where: {id: {_eq: $user}}) {
                id
                name
                email 
                image
              }
            
            }`,
        variables: {user: id},
      })
      return await makeQuery(query)
    },
    async getUserByEmail(email) {
      console.log('getUserByEmail', {email})
      const query = JSON.stringify({
        query: `query loadUserByEmail($email: String) {
                  users(where: {email: {_eq: $email}}) {
                    id
                    name
                    email 
                    image
                  }
                }`,
        variables: {email},
      })
      const {users} = await makeQuery(query)

      return isEmpty(users) ? null : first(users) ?? null
    },
    async getUserByAccount({providerAccountId, provider}) {
      console.log('getUserByAccount', {providerAccountId, provider})
      const queryText = `
        query loadUserForAccount($providerAccountId: String, $provider:String ) {
          accounts(where: {providerAccountId: {_eq: $providerAccountId}, provider: {_eq: $provider}}) {
            user {
              image
              id
              name
              email
            }
          }
        }
      `
      const query = JSON.stringify({
        query: queryText,
        variables: {providerAccountId, provider},
      })

      const {accounts} = await makeQuery(query)

      if (isEmpty(accounts)) {
        return null
      }

      const account: any = first(accounts)

      return account.user
    },
    async updateUser(user) {
      console.log('updateUser', {user})
      const queryText = `
      mutation updateUser($id: uuid!, $email: String, $image: String, $name:String) {
        update_users_by_pk(pk_columns: {id: $id}, _set: {email: $email, image: $image, name: $name}) {
          name
          email
          image
        }
      }
      `

      const query = JSON.stringify({
        query: queryText,
        variables: user,
      })

      const {update_users_by_pk} = await makeQuery(query)

      return update_users_by_pk
    },
    async deleteUser(userId) {
      console.log('deleteUser', {userId})
      return
    },
    async linkAccount(account) {
      console.log('linkAccount', {account})
      const mutation = `mutation {
            insert_accounts_one(object: {
              provider: "${account.provider}",
              type: "${account.type}",
              providerAccountId: "${account.providerAccountId}",
              access_token: "${account.access_token}",
              expires_at:" ${Number(account.expires_at)}",
              refresh_token: "${account.refresh_token}",
              token_type: "${account.token_type}",
              scope: "${account.scope}",
              userId: "${account.userId}"
            }
              

            ) { 
              id
              access_token
              expires_at
              provider
              providerAccountId
              refresh_token
              scope
              session_state
              token_type
              type
              userId
            }
          }
          `

      const query = JSON.stringify({
        query: mutation,
      })

      const {insert_accounts_one: updatedAccount} = await makeQuery(query)

      return updatedAccount
    },
    async unlinkAccount({providerAccountId, provider}) {
      console.log('unlinkAccount', {providerAccountId, provider})
      return
    },
    async createSession({sessionToken, userId, expires}) {
      console.log('createSession', {sessionToken, userId, expires})
      const mutation = `mutation {
              insert_sessions_one(object: {
              expires: "${Math.floor(expires.getTime() / 1000)}", 
              sessionToken: "${sessionToken}", 
              userId: "${userId}"}) {
                expires
                id
                sessionToken
                userId
              }
            }
          `

      const query = JSON.stringify({
        query: mutation,
      })

      const {insert_sessions_one} = await makeQuery(query)

      console.log({
        insert_sessions_one,
        expires: new Date(insert_sessions_one.expires * 1000),
      })

      return {
        ...insert_sessions_one,
        expires: new Date(insert_sessions_one.expires * 1000),
      }
    },
    async getSessionAndUser(sessionToken) {
      console.log('getSessionAndUser', {sessionToken})
      const queryText = `
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
      const query = JSON.stringify({
        query: queryText,
        variables: {sessionToken},
      })

      const {sessions} = await makeQuery(query)

      if (isEmpty(sessions)) {
        return null
      }

      const {user, ...session}: any = first(sessions)

      return {
        user,
        session: {
          ...session,
          expires: new Date(session.expires * 1000),
        },
      }
    },
    async updateSession({sessionToken, expires, userId}) {
      console.log('updateSession', sessionToken)
      const queryText = `
        mutation updateSession($expires: Int, $sessionToken: String) {
          update_sessions(where: {sessionToken: {_eq: $sessionToken}}, _set: {expires: $expires}) {
            returning {
              expires
              id
              sessionToken
              userId
            }
          }
        }
      `
      const query = JSON.stringify({
        query: queryText,
        variables: {
          sessionToken,
          expires: Math.floor(Number(expires?.getTime()) / 1000),
        },
      })

      const {update_sessions} = await makeQuery(query)

      return update_sessions.returning
    },
    async deleteSession(sessionToken) {
      console.log('deleteSession', {sessionToken})
      const queryText = `
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
      const query = JSON.stringify({
        query: queryText,
        variables: {
          sessionToken,
        },
      })
      const {delete_sessions} = await makeQuery(query)

      return delete_sessions.returns
    },
    async createVerificationToken({identifier, expires, token}) {
      console.log('createVerificationToken', {identifier, expires, token})
      const queryText = `
      mutation insertVierification($expires: timestamptz, $identifier: String, $token: String) {
        insert_verification_tokens_one(object: {expires: $expires, identifier: $identifier, token: $token}) {
          expires
          identifier
          token
        }
      }`
      const query = JSON.stringify({
        query: queryText,
        variables: {
          identifier,
          expires,
          token,
        },
      })

      const {insert_verification_tokens_one} = await makeQuery(query)

      return {
        ...insert_verification_tokens_one,
        expires: new Date(insert_verification_tokens_one.expires),
      }
    },
    async useVerificationToken({identifier, token}) {
      try {
        const queryText = `
      mutation insertVerification($identifier: String, $token: String) {
        delete_verification_tokens(where: {identifier: {_eq: $identifier}, token: {_eq: $token}}) {
          returning {
            identifier
            token
            expires
          }
        }
      }
      `
        const query = JSON.stringify({
          query: queryText,
          variables: {
            identifier,
            token,
          },
        })

        const {delete_verification_tokens} = await makeQuery(query)

        const vToken = first(
          delete_verification_tokens.returning,
        ) as VerificationToken

        return {
          identifier: vToken.identifier,
          token: vToken.token,
          expires: new Date(vToken.expires),
        }
      } catch (e) {
        return null
      }
    },
  }
}
