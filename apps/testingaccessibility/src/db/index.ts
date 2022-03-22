import {PrismaClient} from '../generated/client'

export * from '../generated/client'

let prisma: PrismaClient

declare module globalThis {
  let prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    errorFormat: 'minimal',
  })
} else {
  globalThis.prisma =
    globalThis.prisma ||
    new PrismaClient({
      errorFormat: 'pretty',
    })
  prisma = globalThis.prisma
}

export default prisma
