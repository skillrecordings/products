import {PrismaClient, Prisma} from '@skillrecordings/database'
import type {Adapter} from 'next-auth/adapters'
import {addSeconds, isAfter} from 'date-fns'

export function PrismaAdapter(p: PrismaClient): Adapter {
  return {
    // @ts-ignore
    createUser: (data) => p.user.create({data}),
    getUser: (id) => p.user.findUnique({where: {id}}),
    getUserByEmail: (email) => p.user.findUnique({where: {email}}),
    async getUserByAccount(provider_providerAccountId) {
      const account = await p.account.findUnique({
        where: {provider_providerAccountId},
        select: {user: true},
      })
      return account?.user ?? null
    },
    // @ts-ignore
    updateUser: ({id, ...data}) => p.user.update({where: {id}, data}),
    deleteUser: (id) => p.user.delete({where: {id}}),
    linkAccount: (data) => p.account.create({data}) as any,
    unlinkAccount: (provider_providerAccountId) =>
      p.account.delete({where: {provider_providerAccountId}}) as any,
    // @ts-ignore
    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.session.findUnique({
        // @ts-ignore
        where: {sessionToken},
        include: {user: true},
      })
      if (!userAndSession) return null
      // @ts-ignore
      const {user, ...session} = userAndSession
      return {user, session}
    },
    // @ts-ignore
    createSession: (data) => p.session.create({data}),
    // @ts-ignore
    updateSession: (data) =>
      // @ts-ignore
      p.session.update({where: {sessionToken: data.sessionToken}, data}),
    // @ts-ignore
    deleteSession: (sessionToken) => p.session.delete({where: {sessionToken}}),
    // @ts-ignore
    async createVerificationToken(data) {
      // @ts-ignore
      const {id: _, ...verificationToken} = await p.verificationToken.create({
        data: {...data, createdAt: new Date()},
      })
      return verificationToken
    },
    // @ts-ignore
    async useVerificationToken(identifier_token) {
      try {
        const token = await p.verificationToken.findFirst({
          where: identifier_token,
        })

        if (token?.createdAt) {
          const TIMEOUT_IN_SECONDS = 90
          const expireMultipleClicks = addSeconds(
            token.createdAt,
            TIMEOUT_IN_SECONDS,
          )
          const now = new Date()

          if (isAfter(expireMultipleClicks, now)) {
            // @ts-ignore
            const {id: _, ...verificationToken} = token
            return verificationToken
          } else {
            // @ts-ignore
            const {id: _, ...verificationToken} =
              await p.verificationToken.delete({
                where: {identifier_token},
              })
            return verificationToken
          }
        }
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025')
          return null
        throw error
      }
    },
  }
}
