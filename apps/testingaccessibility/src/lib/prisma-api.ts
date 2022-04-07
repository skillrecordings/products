import {Prisma} from '@prisma/client'
import {Context, defaultContext} from './context'
import {v4} from 'uuid'
import {SpanContext} from '@vercel/tracing-js'
import {tracer} from '../utils/honeycomb-tracer'
import {Decimal} from '@prisma/client/runtime'

type SDKOptions = {ctx?: Context; spanContext?: SpanContext}

export function getSdk(
  {ctx = defaultContext, spanContext}: SDKOptions = {ctx: defaultContext},
) {
  return {
    async getPurchase(args: Prisma.PurchaseFindUniqueArgs) {
      return await ctx.prisma.purchase.findUnique(args)
    },
    async getPurchasesForUser(userId: string) {
      const span = spanContext
        ? tracer.startSpan('getPurchasesForUser', {
            childOf: spanContext,
          })
        : undefined

      console.log({span})

      const purchases = await ctx.prisma.purchase.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          merchantChargeId: true,
          productId: true,
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      span?.finish()
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

      return await ctx.prisma.$transaction([merchantCharge, purchase])
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

      return merchantCustomer
    },
    async findOrCreateUser(email: string, name?: string | null) {
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

      return {user, isNewUser}
    },
    async getUserByEmail(email: string) {
      return await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      })
    },
    async getProduct(options: Prisma.ProductFindFirstArgs) {
      return await ctx.prisma.product.findFirst(options)
    },
    async getPrice(options: Prisma.PriceFindFirstArgs) {
      return await ctx.prisma.price.findFirst(options)
    },
    async getMerchantCoupon(options: Prisma.MerchantCouponFindFirstArgs) {
      return await ctx.prisma.merchantCoupon.findFirst(options)
    },
    async getCoupon(options: Prisma.CouponFindFirstArgs) {
      const span = spanContext
        ? tracer.startSpan(`getCoupon`, {childOf: spanContext})
        : undefined

      const coupon = await ctx.prisma.coupon.findFirst(options)

      span?.finish()

      return coupon
    },
    async getMerchantCoupons(options: Prisma.MerchantCouponFindManyArgs) {
      return await ctx.prisma.merchantCoupon.findMany(options)
    },
    async getDefaultCouponId(productId?: string) {
      const activeSaleCoupon = await ctx.prisma.coupon.findFirst({
        where: {
          default: true,
          expires: {
            gte: new Date(),
          },
        },
        select: {
          restrictedToProductId: true,
          merchantCouponId: true,
        },
      })

      if (activeSaleCoupon) {
        const {restrictedToProductId, merchantCouponId} = activeSaleCoupon
        const validForProductId =
          restrictedToProductId && restrictedToProductId === productId

        if (validForProductId) return merchantCouponId
      }
    },
  }
}
