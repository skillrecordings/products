import {Adapter} from 'next-auth/adapters'
import {getAdminSDK} from './api'

type HasuraAdapterOptions = {
  endpoint: string
  adminSecret: string
}

export function HasuraAdapter({
  endpoint,
  adminSecret,
}: HasuraAdapterOptions): Adapter {
  const adminSdk = getAdminSDK({
    endpoint,
    adminSecret,
  })

  return {
    async createUser(data) {
      const {insert_users_one: user} = await adminSdk.CreateUser({data})

      return {
        id: user?.id,
        emailVerified: user?.emailVerified,
        image: user?.image,
        name: user?.name,
        email: user?.email,
      }
    },
    async getUser(id: string) {
      const {users_by_pk: user} = await adminSdk.GetUser({id})

      if (!user) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        name: user.name,
      }
    },
    async getUserByEmail(email) {
      const {users} = await adminSdk.QueryUser({
        where: {
          email: {
            _eq: email,
          },
        },
      })

      const user = users?.[0]

      if (!user) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        name: user.name,
      }
    },
    async getUserByAccount({providerAccountId, provider}) {
      const {users} = await adminSdk.QueryUser({
        where: {
          accounts: {
            providerAccountId: {
              _eq: providerAccountId,
            },
            provider: {
              _eq: provider,
            },
          },
        },
      })

      const user = users?.[0]
      if (!user) return null

      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        name: user.name,
      }
    },
    async updateUser(data) {
      const {update_users_by_pk: user} = await adminSdk.UpdateUser({
        id: data.id,
        data,
      })

      return {
        id: user?.id,
        email: user?.email,
        emailVerified: user?.emailVerified,
        image: user?.image,
        name: user?.name,
      }
    },
    async deleteUser(userId) {
      // not implemented
    },
    async linkAccount(data) {
      const {insert_accounts_one: account} = await adminSdk.LinkAccount({
        data,
      })
      return account as any
    },
    async unlinkAccount({providerAccountId, provider}) {
      const {delete_accounts} = await adminSdk.UnlinkAccount({
        provider,
        providerAccountId,
      })
      const account = delete_accounts?.returning?.[0]
      if (!account) return null

      return account as any
    },
    async createSession(data) {
      const resp = await adminSdk.CreateSession({
        data,
      })

      const session = resp.insert_sessions_one!
      return {
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: new Date(session.expires),
      }
    },
    async getSessionAndUser(sessionToken) {
      const {sessions} = await adminSdk.GetSessionAndUser({
        sessionToken,
      })
      const sessionUser = sessions?.[0]
      if (!sessionUser) return null

      return {
        session: {
          id: sessionUser.id,
          userId: sessionUser.userId,
          sessionToken: sessionUser.sessionToken,
          expires: new Date(sessionUser.expires),
        },
        user: {
          id: sessionUser.user.id,
          email: sessionUser.user.email,
          emailVerified: sessionUser.user.emailVerified,
          image: sessionUser.user.image,
          name: sessionUser.user.name,
        },
      }
    },
    async updateSession(data) {
      const {update_sessions} = await adminSdk.UpdateSession({
        sessionToken: data.sessionToken,
        data: data,
      })

      const session = update_sessions?.returning?.[0]
      if (!session) return null

      return {
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: new Date(session.expires),
      }
    },
    async deleteSession(sessionToken) {
      const {delete_sessions} = await adminSdk.DeleteSession({
        sessionToken,
      })

      const session = delete_sessions?.returning?.[0]
      if (!session) return null

      return {
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: new Date(session.expires),
      }
    },
    async createVerificationToken(data) {
      const {insert_verification_tokens_one: token} =
        await adminSdk.CreateVerificationToken({
          data,
        })

      if (!token) return null

      return {
        identifier: token.identifier,
        expires: new Date(token.expires),
        token: token.token,
      }
    },
    async useVerificationToken({identifier, token}) {
      try {
        const {delete_verification_tokens} =
          await adminSdk.UseVerificationToken({
            token,
            identifier,
          })

        const deletedToken = delete_verification_tokens?.returning?.[0]

        if (!deletedToken) return null

        return {
          identifier: deletedToken.identifier,
          expires: deletedToken.expires,
          token: deletedToken.token,
        }
      } catch (error) {
        return null
      }
    },
  }
}
