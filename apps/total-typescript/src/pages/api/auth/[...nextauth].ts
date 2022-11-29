import NextAuth, {type NextAuthOptions, Theme} from 'next-auth'
import {withSentry} from '@sentry/nextjs'
import {
  PrismaAdapter,
  sendVerificationRequest,
} from '@skillrecordings/skill-api'
import {NextApiRequest, NextApiResponse} from 'next'
import {prisma} from '@skillrecordings/database'
import EmailProvider from 'next-auth/providers/email'

async function getUser(userId: string) {
  return prisma.user.findUnique({
    where: {id: userId},
    select: {
      roles: true,
      id: true,
      purchases: {
        select: {
          id: true,
          merchantChargeId: true,
          productId: true,
          createdAt: true,
          totalAmount: true,
          bulkCouponId: true,
          bulkCoupon: {
            select: {
              maxUses: true,
              usedCount: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })
}

const productTheme: Theme = {
  colorScheme: 'auto',
  brandColor: '#10172a',
  logo: 'https://res.cloudinary.com/total-typescript/image/upload/v1667577587/illustrations/gem-darker_wogtyw.png',
}

export const nextAuthOptions: NextAuthOptions = defaultNextAuthOptions({
  theme: productTheme,
})

const createOptions = (req: NextApiRequest) => {
  return defaultNextAuthOptions({
    theme: productTheme,
    req,
  })
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  return withSentry(NextAuth(req, res, createOptions(req)))
}

export function defaultNextAuthOptions(options: {
  theme: Theme
  debug?: boolean
  req?: NextApiRequest
}): NextAuthOptions {
  const {theme, debug, req} = options
  return {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    theme,
    debug,
    adapter: PrismaAdapter(prisma),
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    providers: [
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.POSTMARK_KEY,
            pass: process.env.POSTMARK_KEY,
          },
        },
        from: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        sendVerificationRequest,
      }),
    ],
    callbacks: {
      async session({session, token}) {
        if (token?.id) {
          const user = await getUser(token.id as string)
          if (user) {
            const {roles, purchases} = user
            session.purchases = purchases
            session.role = roles
            token.purchases = purchases
            token.role = roles
          }
        } else {
          token.purchases = []
          session.purchases = []
        }

        return session
      },
      async jwt({token, user: authUser}) {
        if (authUser) {
          const user = await getUser(authUser.id)
          if (user) {
            const {roles, id, purchases} = user
            token.id = id
            token.purchases = purchases
            token.role = roles || 'user'
          }
        } else if (req?.url === '/api/auth/session?update' && token?.id) {
          const user = await getUser(token.id as string)
          if (user) {
            const {roles, id, purchases} = user
            token.id = id
            token.purchases = purchases
            token.role = roles || 'user'
          }
        }
        return token
      },
    },
    pages: {
      signIn: '/login',
      error: '/error',
      verifyRequest: '/check-your-email',
    },
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
}
