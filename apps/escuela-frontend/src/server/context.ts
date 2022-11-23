import {PrismaClient} from '@skillrecordings/database'
import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import {getSession} from 'next-auth/react'

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
})
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({req})
  console.debug('createContext for', session?.user?.name ?? 'unknown user')
  return {
    req,
    res,
    prisma,
    session,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
