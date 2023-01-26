import {PrismaClient} from '@skillrecordings/database'
import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import {NextApiRequest, NextApiResponse} from 'next'
import {Session} from 'next-auth'
import {getSession} from 'next-auth/react'

type SkillTrpcCreateContext = (
  options: trpcNext.CreateNextContextOptions,
) => Promise<{
  req: NextApiRequest
  res: NextApiResponse
  session: Session | null
  prisma: PrismaClient<{log: ('query' | 'warn' | 'error')[]}, never, false>
}>

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
export const createContext: SkillTrpcCreateContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({req})
  return {
    req,
    res,
    prisma,
    session,
  }
}

export type TrpcContext = trpc.inferAsyncReturnType<typeof createContext>
