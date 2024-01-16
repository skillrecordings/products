import {PrismaClient} from '@skillrecordings/database'
import {inferAsyncReturnType} from '@trpc/server'
import {type CreateNextContextOptions} from '@trpc/server/adapters/next'
import {GetServerSidePropsContext} from 'next'
import {getServerSession} from 'next-auth'
import {NextAuthOptions} from 'next-auth'

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
})

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
  nextAuthOptions: NextAuthOptions
}) => {
  return getServerSession(ctx.req, ctx.res, ctx.nextAuthOptions)
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({
  req,
  res,
  nextAuthOptions,
}: CreateNextContextOptions & {nextAuthOptions: NextAuthOptions}) => {
  const session = await getServerAuthSession({req, res, nextAuthOptions})

  return {
    req,
    res,
    session,
    prisma,
    nextAuthOptions,
  }
}

export type TrpcContext = inferAsyncReturnType<typeof createContext>
