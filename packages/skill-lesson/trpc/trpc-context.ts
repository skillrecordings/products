import {PrismaClient} from '@skillrecordings/database'
import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

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
  return {
    req,
    res,
    prisma,
  }
}

export type TrpcContext = trpc.inferAsyncReturnType<typeof createContext>
