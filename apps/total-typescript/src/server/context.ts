import {PrismaClient} from '@skillrecordings/database'
import * as trpc from '@trpc/server'
import {inferAsyncReturnType} from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import {getSession} from 'next-auth/react'

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
})

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({req})
  console.debug(
    'createContext for',
    req.cookies['ck_subscriber'] ?? 'unknown user',
  )
  return {
    req,
    res,
    prisma,
    session,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
