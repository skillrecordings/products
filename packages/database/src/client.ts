import {PrismaClient} from '@prisma/client'

export * from '@prisma/client'

export {Decimal} from '@prisma/client/runtime'

let prisma: PrismaClient

declare module globalThis {
  let prisma: PrismaClient
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

export {prisma}
