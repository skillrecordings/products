import {Prisma} from '@prisma/client'
import {Context, defaultContext} from './context'

export function getSdk(ctx: Context = defaultContext) {
  return {
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
      return await ctx.prisma.coupon.findFirst(options)
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
