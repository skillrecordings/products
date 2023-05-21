import {PrismaClient} from '@skillrecordings/database'
import {inferAsyncReturnType} from '@trpc/server'
import {type CreateNextContextOptions} from '@trpc/server/adapters/next'

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
  nextAuthOptions,
}: CreateNextContextOptions & {nextAuthOptions?: any}) => {
  return {
    req,
    res,
    prisma,
    nextAuthOptions,
  }
}

export type TrpcContext = inferAsyncReturnType<typeof createContext>
