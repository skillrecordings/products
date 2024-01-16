/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import {TRPCError, initTRPC} from '@trpc/server'
import superjson from 'superjson'
import {type TrpcContext} from './trpc-context'
import NextAuth, {DefaultSession} from 'next-auth'

type Resolve<T> = T extends Function ? T : {[K in keyof T]: T[K]}

type User = Resolve<
  {
    role?: string
    purchases?: any[]
  } & DefaultSession['user']
>

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the
   * `SessionProvider` React Context
   */
  interface Session {
    user?: User
  }
}

const t = initTRPC.context<TrpcContext>().create({
  /**
   * @see https://trpc.io/docs/v10/data-transformers
   */
  transformer: superjson,
  /**
   * @see https://trpc.io/docs/v10/error-formatting
   */
  errorFormatter({shape}) {
    return shape
  },
})

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const router = t.router

const isAdmin = t.middleware(({ctx, next}) => {
  const userRole = ctx.session?.user?.role || 'User'
  const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(userRole)

  if (!isAdmin) {
    throw new TRPCError({code: 'UNAUTHORIZED'})
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: {...ctx.session, user: ctx.session?.user},
    },
  })
})

export const adminProcedure = t.procedure.use(isAdmin)

const isAuthed = t.middleware(({ctx, next}) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({code: 'UNAUTHORIZED'})
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: {...ctx.session, user: ctx.session.user},
    },
  })
})

export const privateProcedure = t.procedure.use(isAuthed)

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v10/procedures
 **/
export const publicProcedure = t.procedure

/**
 * @see https://trpc.io/docs/v10/middlewares
 */
export const middleware = t.middleware

/**
 * @see https://trpc.io/docs/v10/merging-routers
 */
export const mergeRouters = t.mergeRouters
