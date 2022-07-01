import {Prisma, Purchase} from '@prisma/client'
import {Context, defaultContext} from './context'
import {v4} from 'uuid'
import {SpanContext} from '@vercel/tracing-js'
import {tracer} from '../utils/honeycomb-tracer'
import prisma from '../db'

type SDKOptions = {ctx?: Context; spanContext?: SpanContext}

function startSpan(name: string, childOf?: SpanContext) {
  if (process.env.NODE_ENV === 'production') {
    return tracer.startSpan(name, {childOf})
  }

  return {finish: () => {}}
}

export function getSdk(
  {ctx = defaultContext, spanContext}: SDKOptions = {ctx: defaultContext},
) {
  return {
    async couponForIdOrCode({
      code,
      couponId,
    }: {
      code?: string
      couponId?: string
    }) {
      return await prisma.coupon.findFirst({
        where: {
          OR: [
            {
              OR: [{id: couponId}, {code}],
              expires: {
                gte: new Date(),
              },
            },
            {OR: [{id: couponId}, {code}], expires: null},
          ],
        },
        include: {
          merchantCoupon: true,
        },
      })
    },
    async availableUpgradesForProduct(purchases: any, productId: string) {
      return purchases
        ? await prisma.upgradableProducts.findMany({
            where: {
              upgradableFromId: {
                in: purchases.map(({productId}: Purchase) => productId),
              },
              upgradableToId: productId,
            },
            select: {
              upgradableTo: {
                select: {
                  id: true,
                  name: true,
                },
              },
              upgradableFrom: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          })
        : []
    },
    async toggleLessonProgressForUser({
      userId,
      lessonSlug,
    }: {
      userId: string
      lessonSlug: string
    }) {
      const span = startSpan('toggleLessonProgressForUser', spanContext)
      let lessonProgress = await ctx.prisma.lessonProgress.findFirst({
        where: {
          userId,
          lessonSlug,
        },
      })

      const now = new Date()

      if (lessonProgress) {
        if (lessonProgress.completedAt) {
          lessonProgress = await ctx.prisma.lessonProgress.update({
            where: {id: lessonProgress.id},
            data: {
              completedAt: null,
              updatedAt: now,
            },
          })
        } else {
          lessonProgress = await ctx.prisma.lessonProgress.update({
            where: {id: lessonProgress.id},
            data: {
              completedAt: now,
              updatedAt: now,
            },
          })
        }
      } else {
        lessonProgress = await ctx.prisma.lessonProgress.create({
          data: {
            userId,
            lessonSlug,
            completedAt: now,
            updatedAt: now,
          },
        })
      }
      span.finish()
      return lessonProgress
    },
    async getPurchase(args: Prisma.PurchaseFindUniqueArgs) {
      return await ctx.prisma.purchase.findUnique(args)
    },
    async getPurchasesForUser(userId: string) {
      const span = startSpan('getPurchasesForUser', spanContext)
      const purchases = await ctx.prisma.purchase.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          merchantChargeId: true,
          productId: true,
          createdAt: true,
          totalAmount: true,
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
      })

      span.finish()
      return purchases
    },
    async createMerchantChargeAndPurchase(options: {
      userId: string
      productId: string
      stripeChargeId: string
      merchantAccountId: string
      merchantProductId: string
      merchantCustomerId: string
      stripeChargeAmount: number
    }) {
      const {
        userId,
        stripeChargeId,
        merchantAccountId,
        merchantProductId,
        merchantCustomerId,
        productId,
        stripeChargeAmount,
      } = options
      const span = startSpan('createMerchantChargeAndPurchase', spanContext)
      // we are using uuids so we can generate this!
      // this is needed because the following actions
      // are dependant
      const merchantChargeId = v4()
      const purchaseId = v4()

      const merchantCharge = ctx.prisma.merchantCharge.create({
        data: {
          id: merchantChargeId,
          userId,
          identifier: stripeChargeId,
          merchantAccountId,
          merchantProductId,
          merchantCustomerId,
        },
      })

      const purchase = ctx.prisma.purchase.create({
        data: {
          id: purchaseId,
          userId,
          productId,
          merchantChargeId,
          totalAmount: stripeChargeAmount / 100,
        },
      })

      const result = await ctx.prisma.$transaction([merchantCharge, purchase])

      span.finish()
      return result
    },
    async findOrCreateMerchantCustomer({
      userId,
      identifier,
      merchantAccountId,
    }: {
      userId: string
      identifier: string
      merchantAccountId: string
    }) {
      const span = startSpan('findOrCreateMerchantCustomer', spanContext)

      let merchantCustomer = await ctx.prisma.merchantCustomer.findUnique({
        where: {
          identifier,
        },
      })

      if (!merchantCustomer) {
        merchantCustomer = await ctx.prisma.merchantCustomer.create({
          data: {
            userId,
            identifier,
            merchantAccountId,
          },
        })
      }

      span.finish()

      return merchantCustomer
    },
    async findOrCreateUser(email: string, name?: string | null) {
      const span = startSpan('findOrCreateUser', spanContext)
      let isNewUser = false
      let user = await ctx.prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!user) {
        isNewUser = true
        user = await ctx.prisma.user.create({
          data: {email, name},
        })
      }

      span.finish()
      return {user, isNewUser}
    },
    async getUserByEmail(email: string) {
      const span = startSpan('getUserByEmail', spanContext)
      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      })

      span.finish()
      return user
    },
    async getProduct(options: Prisma.ProductFindFirstArgs) {
      const span = startSpan('getProduct', spanContext)
      const product = await ctx.prisma.product.findFirst(options)
      span.finish()
      return product
    },
    async getPrice(options: Prisma.PriceFindFirstArgs) {
      const span = startSpan('getPrice', spanContext)
      const price = await ctx.prisma.price.findFirst(options)
      span.finish()
      return price
    },
    async getMerchantCoupon(options: Prisma.MerchantCouponFindFirstArgs) {
      const span = startSpan('getMerchantCoupon', spanContext)
      const merchantCoupon = await ctx.prisma.merchantCoupon.findFirst(options)
      span.finish()
      return merchantCoupon
    },
    async getCoupon(options: Prisma.CouponFindFirstArgs) {
      const span = startSpan('getCoupon', spanContext)
      const coupon = await ctx.prisma.coupon.findFirst(options)

      span.finish()

      return coupon
    },
    async getMerchantCoupons(options: Prisma.MerchantCouponFindManyArgs) {
      const span = startSpan('getMerchantCoupons', spanContext)
      const merchantCoupons = await ctx.prisma.merchantCoupon.findMany(options)
      span.finish()
      return merchantCoupons
    },
    async getDefaultCoupon(productId?: string) {
      const span = startSpan('getDefaultCouponId', spanContext)
      const activeSaleCoupon = await ctx.prisma.coupon.findFirst({
        where: {
          default: true,
          expires: {
            gte: new Date(),
          },
        },
        select: {
          restrictedToProductId: true,
          merchantCoupon: true,
        },
      })

      span.finish()

      if (activeSaleCoupon) {
        const {restrictedToProductId, merchantCoupon} = activeSaleCoupon
        const validForProductId = restrictedToProductId
          ? restrictedToProductId === productId
          : true

        if (validForProductId) return merchantCoupon
      }
    },
  }
}
