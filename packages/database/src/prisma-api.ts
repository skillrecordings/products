import {Context, defaultContext} from './context'
import {v4} from 'uuid'
import {Prisma, Purchase, User} from '@prisma/client'

type SDKOptions = {ctx?: Context}

export function getSdk(
  {ctx = defaultContext}: SDKOptions = {ctx: defaultContext},
) {
  return {
    async getPurchaseDetails(purchaseId: string, userId: string) {
      const allPurchases = await ctx.prisma.purchase.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          productId: true,
        },
      })
      const purchase = await ctx.prisma.purchase.findFirst({
        where: {
          id: purchaseId as string,
          userId,
        },
        select: {
          merchantChargeId: true,
          bulkCoupon: {
            select: {
              id: true,
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
          status: true,
        },
      })

      if (!purchase) {
        return {}
      }

      const availableUpgrades =
        purchase.status === 'Valid'
          ? await ctx.prisma.upgradableProducts.findMany({
              where: {
                AND: [
                  {
                    upgradableFromId: purchase?.product?.id,
                  },
                  {
                    NOT: {
                      upgradableToId: {
                        in: allPurchases.map(({productId}) => productId),
                      },
                    },
                  },
                ],
              },
              select: {
                upgradableTo: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            })
          : []

      const existingPurchase = await ctx.prisma.purchase.findFirst({
        where: {
          userId,
          productId: purchase?.product?.id,
          id: {
            not: purchaseId as string,
          },
          bulkCoupon: null,
          status: 'Valid',
        },
        select: {
          id: true,
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      return {
        purchase,
        existingPurchase,
        availableUpgrades,
      }
    },
    async getPurchaseForStripeCharge(stripeChargeId: string) {
      return await ctx.prisma.purchase.findFirst({
        where: {
          merchantCharge: {
            identifier: stripeChargeId,
          },
        },
        include: {
          bulkCoupon: {
            include: {
              bulkCouponPurchases: true,
            },
          },
        },
      })
    },
    async updatePurchaseStatusForCharge(
      chargeId: string,
      status: 'Valid' | 'Refunded' | 'Disputed' | 'Banned',
    ): Promise<Purchase | undefined> {
      const purchase = await ctx.prisma.purchase.findFirst({
        where: {
          merchantCharge: {
            identifier: chargeId,
          },
        },
      })

      if (purchase) {
        return await ctx.prisma.purchase.update({
          where: {
            id: purchase.id,
          },
          data: {
            status: status,
          },
        })
      } else {
        throw new Error(`no-purchase-found-for-charge ${chargeId}`)
      }
    },
    async couponForIdOrCode({
      code,
      couponId,
    }: {
      code?: string
      couponId?: string
    }) {
      return await ctx.prisma.coupon.findFirst({
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
        ? await ctx.prisma.upgradableProducts.findMany({
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
    async completeLessonProgressForUser({
      userId,
      lessonSlug,
    }: {
      userId: string
      lessonSlug: string
    }) {
      let lessonProgress = await ctx.prisma.lessonProgress.findFirst({
        where: {
          userId,
          lessonSlug,
        },
      })

      const now = new Date()

      if (lessonProgress) {
        lessonProgress = await ctx.prisma.lessonProgress.update({
          where: {id: lessonProgress.id},
          data: {
            completedAt: now,
            updatedAt: now,
          },
        })
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
      return lessonProgress
    },
    async toggleLessonProgressForUser({
      userId,
      lessonSlug,
    }: {
      userId: string
      lessonSlug: string
    }) {
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
      return lessonProgress
    },
    async getPurchase(args: Prisma.PurchaseFindUniqueArgs) {
      return await ctx.prisma.purchase.findUnique(args)
    },
    async getPurchasesForUser(userId?: string) {
      const purchases = userId
        ? await ctx.prisma.purchase.findMany({
            where: {
              userId,
              status: 'Valid',
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
              redeemedBulkCouponId: true,
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          })
        : []

      return purchases
    },
    async getMerchantProduct(stripeProductId: string) {
      return ctx.prisma.merchantProduct.findFirst({
        where: {
          identifier: stripeProductId,
        },
      })
    },
    async createMerchantChargeAndPurchase(options: {
      userId: string
      productId: string
      stripeChargeId: string
      merchantAccountId: string
      merchantProductId: string
      merchantCustomerId: string
      stripeChargeAmount: number
      quantity?: number
    }) {
      const {
        userId,
        stripeChargeId,
        merchantAccountId,
        merchantProductId,
        merchantCustomerId,
        productId,
        stripeChargeAmount,
        quantity = 1,
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

      // Check if this user has already purchased a bulk coupon, in which
      // case, we'll be able to treat this purchase as adding seats.
      //
      // TODO: I believe the `maxUses` check is redundant. If there is at
      // least one `bulkCouponPurchase` attached to this Coupon, then it is a
      // bulk coupon for this user.
      const existingBulkCoupon = await ctx.prisma.coupon.findFirst({
        where: {
          maxUses: {
            gt: 1,
          },
          bulkCouponPurchases: {
            some: {userId},
          },
        },
      })

      // Note: if the user already has a bulk purchase/coupon, then if they are
      // only adding 1 seat to the team, then it is still a "bulk purchase" and
      // we need to add it to their existing Bulk Coupon.
      const isBulkPurchase = quantity > 1 || !!existingBulkCoupon

      let bulkCouponId = null
      let coupon = null

      if (isBulkPurchase) {
        bulkCouponId = existingBulkCoupon ? existingBulkCoupon.id : v4()

        // Create or Update Bulk Coupon Record
        if (existingBulkCoupon) {
          coupon = ctx.prisma.coupon.update({
            where: {
              id: existingBulkCoupon.id,
            },
            data: {
              maxUses: existingBulkCoupon.maxUses + quantity,
            },
          })
        } else {
          coupon = ctx.prisma.coupon.create({
            data: {
              restrictedToProductId: productId,
              maxUses: quantity,
              percentageDiscount: 1.0,
              status: 1,
            },
          })
        }
      }

      const purchase = ctx.prisma.purchase.create({
        data: {
          id: purchaseId,
          userId,
          productId,
          merchantChargeId,
          totalAmount: stripeChargeAmount / 100,
          bulkCouponId,
        },
      })

      if (coupon) {
        return await ctx.prisma.$transaction([merchantCharge, purchase, coupon])
      } else {
        return await ctx.prisma.$transaction([merchantCharge, purchase])
      }
    },
    async findOrCreateMerchantCustomer({
      user,
      identifier,
      merchantAccountId,
    }: {
      user: User
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
            userId: user.id,
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
      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      })

      return user
    },
    async getProduct(options: Prisma.ProductFindFirstArgs) {
      const product = await ctx.prisma.product.findFirst(options)
      return product
    },
    async getPrice(options: Prisma.PriceFindFirstArgs) {
      const price = await ctx.prisma.price.findFirst(options)
      return price
    },
    async getMerchantCoupon(options: Prisma.MerchantCouponFindFirstArgs) {
      const merchantCoupon = await ctx.prisma.merchantCoupon.findFirst(options)
      return merchantCoupon
    },
    async getCoupon(options: Prisma.CouponFindFirstArgs) {
      const coupon = await ctx.prisma.coupon.findFirst(options)
      return coupon
    },
    async getMerchantCoupons(options: Prisma.MerchantCouponFindManyArgs) {
      const merchantCoupons = await ctx.prisma.merchantCoupon.findMany(options)
      return merchantCoupons
    },
    async getDefaultCoupon(productId?: string) {
      const activeSaleCoupon = await ctx.prisma.coupon.findFirst({
        where: {
          default: true,
          expires: {
            gte: new Date(),
          },
        },
        include: {
          merchantCoupon: true,
        },
      })
      if (activeSaleCoupon) {
        const {restrictedToProductId} = activeSaleCoupon
        const validForProductId = restrictedToProductId
          ? restrictedToProductId === productId
          : true

        const {merchantCoupon: defaultMerchantCoupon, ...defaultCoupon} =
          activeSaleCoupon

        if (validForProductId) return {defaultMerchantCoupon, defaultCoupon}
      }
    },
  }
}
