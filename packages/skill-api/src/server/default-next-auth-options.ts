import {type CookiesOptions, type NextAuthOptions, type Theme} from 'next-auth'
import {PrismaAdapter} from './skill-next-auth-prisma-adapter'
import {sendVerificationRequest} from './send-verification-request'
import {prisma} from '@skillrecordings/database'
import EmailProvider from 'next-auth/providers/email'
import {NextApiRequest, NextApiResponse} from 'next'
import {Inngest} from 'inngest'
import {sanityClient} from '../lib/sanity-client'
import {z} from 'zod'

async function getUser(userId: string) {
  return prisma.user.findUnique({
    where: {id: userId},
    select: {
      roles: true,
      id: true,
      name: true,
      purchases: {
        select: {
          id: true,
          status: true,
          country: true,
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

export const createOptions = (config: {
  req?: NextApiRequest
  res?: NextApiResponse
  theme: Theme
  providers?: any[]
  debug?: boolean
  cookies?: Partial<CookiesOptions>
  skillCookieDomain?: string
}) => {
  return defaultNextAuthOptions(config)
}

export function defaultNextAuthOptions(options: {
  theme: Theme
  debug?: boolean
  req?: NextApiRequest
  res?: NextApiResponse
  providers?: any[]
  cookies?: Partial<CookiesOptions>
  skillCookieDomain?: string
}): NextAuthOptions {
  const {
    theme,
    debug,
    req,
    res,
    cookies,
    providers = [],
    skillCookieDomain,
  } = options
  return {
    secret: process.env.NEXTAUTH_SECRET,
    events: {
      signOut: async () => {
        if (res) {
          res.setHeader(
            'Set-Cookie',
            `skill=0; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT${
              skillCookieDomain ? `; Domain=${skillCookieDomain}` : ''
            }`,
          )
        }
      },
      createUser: async ({user}) => {
        if (process.env.INNGEST_EVENT_KEY) {
          const inngest = new Inngest({
            id:
              process.env.INNGEST_APP_NAME ||
              process.env.NEXT_PUBLIC_SITE_TITLE ||
              'Sanity Products Webhook',
            eventKey: process.env.INNGEST_EVENT_KEY,
          })

          await inngest.send({
            name: 'user/created',
            data: {},
            user,
          })
        }
      },
    },
    session: {
      strategy: 'jwt',
    },
    cookies,
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
      ...providers,
    ],
    callbacks: {
      async session({session, token}) {
        if (token?.id) {
          const user = await getUser(token.id as string)

          const dbProducts =
            user?.purchases.map((purchase) => purchase.product) || []

          console.log(dbProducts.map((product) => product.id))

          const parsedModules = z
            .object({
              free: z.array(z.string()).default([]),
              paid: z.array(z.string()).default([]),
            })
            .safeParse(
              await sanityClient.fetch(
                `{
              "free": *[_type == 'module' && moduleType == 'tutorial'].slug.current,
              "paid": array::unique(*[_type == 'product' && productId in $productIds].modules[]->slug.current)
            }`,
                {
                  productIds: dbProducts.map((product) => product.id),
                },
              ),
            )

          if (res && parsedModules.success) {
            const {free, paid} = parsedModules.data
            res.setHeader(
              'Set-Cookie',
              `skill=${[...free, ...paid].join(',')}; Path=/; SameSite=Lax ${
                skillCookieDomain ? `; Domain=${skillCookieDomain}` : ''
              }`,
            )
          }

          if (user && session.user) {
            const {roles, purchases} = user
            session.user.purchases = purchases
            session.user.role = roles
            // session.purchases = purchases
            // session.role = roles
            token.purchases = purchases
            token.role = roles
          }
        } else {
          token.purchases = []
          // session.user.purchases = []
        }

        return session
      },
      async jwt({token, user: authUser, trigger, session}) {
        if (trigger === 'update' && token?.id) {
          const user = await getUser(token.id as string)
          token.name = user?.name
        }
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
