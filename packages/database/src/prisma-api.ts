import {Context, defaultContext} from './context'
import {v4 as uuidv4} from 'uuid'
import {Prisma, Purchase, PurchaseUserTransferState, User} from '@prisma/client'

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
          id: true,
          merchantChargeId: true,
          createdAt: true,
          totalAmount: true,
          country: true,
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
        purchase.status === 'Valid' || purchase.status === 'Restricted'
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
          status: {
            in: ['Valid', 'Restricted'],
          },
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
          merchantSession: {
            select: {
              identifier: true,
              merchantAccount: {
                select: {
                  label: true,
                },
              },
            },
          },
        },
      })
    },
    async updatePurchaseStatusForCharge(
      chargeId: string,
      status: 'Valid' | 'Refunded' | 'Disputed' | 'Banned' | 'Restricted',
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
      if (!code && !couponId) return null
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
      lessonId,
    }: {
      userId: string
      lessonId?: string
    }) {
      let lessonProgress = await ctx.prisma.lessonProgress.findFirst({
        where: {
          userId,
          lessonId,
        },
      })

      const now = new Date()

      if (lessonProgress) {
        if (!lessonProgress.completedAt) {
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
            lessonId,
            completedAt: now,
            updatedAt: now,
          },
        })
      }
      return lessonProgress
    },
    async clearLessonProgressForUser({
      userId,
      lessons,
    }: {
      userId: string
      lessons: {id: string; slug: string}[]
    }) {
      const lessonProgress = await ctx.prisma.lessonProgress.findMany({
        where: {
          userId,
          lessonId: {
            in: lessons.map(({id}) => id),
          },
        },
      })

      const now = new Date()

      await Promise.all(
        lessonProgress.map((progress) => {
          return ctx.prisma.lessonProgress.update({
            where: {id: progress.id},
            data: {
              completedAt: null,
              updatedAt: now,
            },
          })
        }),
      )
    },
    async toggleLessonProgressForUser({
      userId,
      lessonId,
      lessonSlug,
    }: {
      userId: string
      lessonId?: string
      lessonSlug?: string
    }) {
      let lessonProgress = await ctx.prisma.lessonProgress.findFirst({
        where: {
          userId,
          lessonId,
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
            lessonId,
            lessonSlug,
            completedAt: now,
            updatedAt: now,
          },
        })
      }
      return lessonProgress
    },
    async getLessonProgressForUser(userId: string) {
      const userProgress = await ctx.prisma.user.findFirst({
        where: {id: userId as string},
        include: {
          lessonProgresses: {
            orderBy: {
              updatedAt: 'desc',
            },
          },
        },
      })
      return userProgress?.lessonProgresses
    },
    async getLessonProgresses() {
      const progresses = await ctx.prisma.lessonProgress.findMany({
        orderBy: {
          completedAt: 'asc',
        },
      })
      return progresses
    },
    async getPurchaseWithUser(purchaseId: string) {
      return await ctx.prisma.purchase.findFirst({
        where: {
          id: purchaseId as string,
          status: {in: ['Valid', 'Restricted']},
        },
        include: {
          user: true,
        },
      })
    },
    async getCouponWithBulkPurchases(couponId: string) {
      return await ctx.prisma.coupon.findFirst({
        where: {id: couponId},
        include: {bulkCouponPurchases: {select: {bulkCouponId: true}}},
      })
    },
    async getPurchase(args: Prisma.PurchaseFindFirstArgs) {
      return await ctx.prisma.purchase.findFirst(args)
    },
    async getPurchases(args?: Prisma.PurchaseFindManyArgs) {
      return await ctx.prisma.purchase.findMany(args)
    },
    async getPurchasesForUser(userId?: string) {
      const purchases = userId
        ? await ctx.prisma.purchase.findMany({
            orderBy: {
              createdAt: 'asc',
            },
            where: {
              userId,
              status: {
                in: ['Valid', 'Refunded', 'Restricted'],
              },
            },
            select: {
              id: true,
              status: true,
              merchantChargeId: true,
              productId: true,
              createdAt: true,
              totalAmount: true,
              country: true,
              bulkCoupon: {
                select: {
                  id: true,
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
    async getMerchantCharge(merchantChargeId: string) {
      return await ctx.prisma.merchantCharge.findUnique({
        where: {
          id: merchantChargeId,
        },
        select: {
          id: true,
          identifier: true,
          merchantProductId: true,
        },
      })
    },
    async createMerchantChargeAndPurchase(options: {
      userId: string
      productId: string
      stripeChargeId: string
      stripeCouponId?: string
      merchantAccountId: string
      merchantProductId: string
      merchantCustomerId: string
      stripeChargeAmount: number
      quantity?: number
      bulk?: boolean
      checkoutSessionId: string
      appliedPPPStripeCouponId: string | undefined
      upgradedFromPurchaseId: string | undefined
      usedCouponId: string | undefined
      country?: string
    }) {
      const {
        userId,
        stripeChargeId,
        stripeCouponId,
        merchantAccountId,
        merchantProductId,
        merchantCustomerId,
        productId,
        stripeChargeAmount,
        quantity = 1,
        checkoutSessionId,
        appliedPPPStripeCouponId,
        upgradedFromPurchaseId,
        country,
        usedCouponId,
      } = options
      // we are using uuids so we can generate this!
      // this is needed because the following actions
      // are dependant
      const merchantChargeId = uuidv4()
      const purchaseId = uuidv4()

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

      // if this user has already purchased this product, then an additional
      // purchase (even for only 1 seat) should be processed as a bulk
      // purchase so that they can distribute the seat to someone else.
      //
      // if an existingPurchase is found, but no existingBulkCoupon is found,
      // then the logic below will account for that and create a new bulk
      // coupon for the requested quantity.
      const existingPurchase = await ctx.prisma.purchase.findFirst({
        where: {
          productId,
          userId,
          status: {
            in: ['Valid', 'Restricted'],
          },
        },
      })

      // Check if this user has already purchased a bulk coupon for this
      // product, in which case, we'll be able to treat this purchase as
      // adding seats.
      const existingBulkCoupon = await ctx.prisma.coupon.findFirst({
        where: {
          restrictedToProductId: productId,
          bulkCouponPurchases: {
            some: {userId},
          },
        },
      })

      // Note: if the user already has a bulk purchase/coupon, then if they are
      // only adding 1 seat to the team, then it is still a "bulk purchase" and
      // we need to add it to their existing Bulk Coupon.
      const isBulkPurchase =
        quantity > 1 ||
        Boolean(existingBulkCoupon) ||
        options.bulk ||
        Boolean(existingPurchase?.status === 'Valid')

      let bulkCouponId = null
      let coupon = null

      if (isBulkPurchase) {
        bulkCouponId =
          existingBulkCoupon !== null ? existingBulkCoupon.id : uuidv4()

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
          const merchantCoupon = await ctx.prisma.merchantCoupon.findFirst({
            where: {identifier: stripeCouponId},
          })

          coupon = ctx.prisma.coupon.create({
            data: {
              id: bulkCouponId,
              restrictedToProductId: productId,
              maxUses: quantity,
              percentageDiscount: 1.0,
              status: 1,
              merchantCouponId: merchantCoupon?.id,
            },
          })
        }
      }

      const merchantSessionId = uuidv4()

      const merchantSession = ctx.prisma.merchantSession.create({
        data: {
          id: merchantSessionId,
          identifier: checkoutSessionId,
          merchantAccountId,
        },
      })

      const merchantCoupon = stripeCouponId
        ? await ctx.prisma.merchantCoupon.findFirst({
            where: {identifier: stripeCouponId},
          })
        : null

      const pppMerchantCoupon = appliedPPPStripeCouponId
        ? await ctx.prisma.merchantCoupon.findFirst({
            where: {identifier: appliedPPPStripeCouponId, type: 'ppp'},
          })
        : null

      const purchase = ctx.prisma.purchase.create({
        data: {
          id: purchaseId,
          status:
            merchantCoupon?.type === 'ppp' || Boolean(pppMerchantCoupon)
              ? 'Restricted'
              : 'Valid',
          userId,
          productId,
          merchantChargeId,
          totalAmount: stripeChargeAmount / 100,
          bulkCouponId,
          merchantSessionId,
          country,
          upgradedFromId: upgradedFromPurchaseId || null,
          couponId: usedCouponId || null,
        },
      })

      const oneWeekInMilliseconds = 1000 * 60 * 60 * 24 * 7
      const purchaseUserTransfer = ctx.prisma.purchaseUserTransfer.create({
        data: {
          sourceUserId: userId,
          purchaseId: purchaseId,
          expiresAt: existingPurchase
            ? new Date()
            : new Date(Date.now() + oneWeekInMilliseconds),
        },
      })

      if (coupon) {
        return await ctx.prisma.$transaction([
          purchase,
          merchantCharge,
          coupon,
          purchaseUserTransfer,
          merchantSession,
        ])
      } else {
        return await ctx.prisma.$transaction([
          purchase,
          merchantCharge,
          purchaseUserTransfer,
          merchantSession,
        ])
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
      } else if (name && user.name !== name) {
        user = await ctx.prisma.user.update({
          where: {id: user.id},
          data: {name},
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
    async getUserById(options: Prisma.UserFindUniqueArgs) {
      const user = await ctx.prisma.user.findUnique(options)
      return user
    },
    async getProduct(options: Prisma.ProductFindFirstArgs) {
      const product = await ctx.prisma.product.findFirst(options)
      return product
    },
    async updateOrCreateProduct(options: Prisma.ProductUpsertArgs) {
      const product = await ctx.prisma.product.upsert(options)
      return product
    },
    async deleteProduct(options: Prisma.ProductDeleteArgs) {
      const product = await ctx.prisma.product.delete(options)
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
    async getCoupons(options?: Prisma.CouponFindManyArgs) {
      const coupons = await ctx.prisma.coupon.findMany(options)
      return coupons
    },
    async getMerchantCoupons(options: Prisma.MerchantCouponFindManyArgs) {
      const merchantCoupons = await ctx.prisma.merchantCoupon.findMany(options)
      return merchantCoupons
    },
    async getDefaultCoupon(productIds?: string[]) {
      const activeSaleCoupon = await ctx.prisma.coupon.findFirst({
        where: {
          default: true,
          expires: {
            gte: new Date(),
          },
          // we either want:
          // 1) a coupon restricted to one of the given product IDs
          // 2) a coupon that isn't restricted to a product ID
          OR: [
            {
              ...(productIds && {
                restrictedToProductId: {
                  in: productIds,
                },
              }),
            },
            {
              restrictedToProductId: null,
            },
          ],
        },
        orderBy: {
          percentageDiscount: 'desc',
        },
        include: {
          merchantCoupon: true,
          product: true,
        },
      })
      if (activeSaleCoupon) {
        const {restrictedToProductId} = activeSaleCoupon
        const validForProductId = restrictedToProductId
          ? productIds?.includes(restrictedToProductId)
          : true

        const {merchantCoupon: defaultMerchantCoupon, ...defaultCoupon} =
          activeSaleCoupon
        if (validForProductId) return {defaultMerchantCoupon, defaultCoupon}
      }
    },
    async transferPurchasesToNewUser({
      merchantCustomerId,
      userId,
    }: {
      merchantCustomerId: string
      userId: string
    }) {
      const chargesToUpdate = await ctx.prisma.merchantCharge.findMany({
        where: {
          merchantCustomerId: merchantCustomerId,
        },
      })

      const chargeUpdates = ctx.prisma.merchantCharge.updateMany({
        where: {
          merchantCustomerId: merchantCustomerId,
        },
        data: {
          userId: userId,
        },
      })

      const purchaseUpdates = ctx.prisma.purchase.updateMany({
        where: {
          merchantChargeId: {
            in: chargesToUpdate.map((c) => c.id),
          },
        },
        data: {
          userId: userId,
        },
      })

      return await ctx.prisma.$transaction([chargeUpdates, purchaseUpdates])
    },
    async getPurchaseUserTransferById({id}: {id: string}) {
      return await ctx.prisma.purchaseUserTransfer.findUnique({
        where: {
          id,
        },
        include: {
          sourceUser: true,
          targetUser: true,
          purchase: true,
        },
      })
    },
    async updatePurchaseUserTransferTransferState({
      id,
      transferState,
    }: {
      id: string
      transferState: PurchaseUserTransferState
    }) {
      return await ctx.prisma.purchaseUserTransfer.update({
        where: {
          id,
        },
        data: {
          transferState,
        },
      })
    },
  }
}
