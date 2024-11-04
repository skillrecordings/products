import {prisma} from '@skillrecordings/database'
import {isAfter, isBefore, isEqual, parse} from 'date-fns'
import {getCouponForCode} from '@skillrecordings/commerce-server'

const ER_v1_PRODUCT_IDS = [
  'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38',
  'kcd_910c9191-5a69-4019-ad1d-c55bea7e9714',
  'kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61',
]

export const eRv1PurchasedOnDate = (
  purchases: {productId: string; createdAt: string}[] = [],
) => {
  return (
    purchases.find((purchase: any) =>
      ER_v1_PRODUCT_IDS.includes(purchase.productId),
    )?.createdAt || null
  )
}

export async function couponForPurchases(
  purchasedOnDate?: string | null,
  couponId?: string,
) {
  if (!purchasedOnDate) {
    return null
  }

  const incomingCoupon = couponId
    ? await getCouponForCode(couponId, [
        'kcd_product-clzlrf0g5000008jm0czdanmz',
      ])
    : null

  const selectedDate = new Date(purchasedOnDate)
  const lessThanDate = parse('2024-03-23', 'yyyy-MM-dd', new Date())
  const comparisonDate = parse('2023-09-23', 'yyyy-MM-dd', new Date())
  const isLessThan = isBefore(selectedDate, lessThanDate)
  const isGreaterOrEqual =
    isAfter(selectedDate, comparisonDate) ||
    isEqual(selectedDate, comparisonDate)
  let merchantCouponId: string | null =
    isGreaterOrEqual && isLessThan
      ? `er-v1-upgrade-75-6ab7`
      : `er-v1-upgrade-50-2dg1`

  if (
    !purchasedOnDate &&
    ['er-v1-upgrade-75-6ab7', 'er-v1-upgrade-50-2dg1'].includes(
      merchantCouponId,
    )
  ) {
    merchantCouponId = null
  }

  const coupon = merchantCouponId
    ? await prisma.coupon.findFirst({
        where: {
          id: merchantCouponId,
        },
        select: {
          id: true,
          percentageDiscount: true,
        },
      })
    : null

  if (
    incomingCoupon &&
    coupon &&
    incomingCoupon.percentageDiscount > coupon.percentageDiscount
  ) {
    return incomingCoupon.id
  }

  return coupon ? coupon.id : null
}

export async function getPurchaseDetails(purchaseId: string, userId: string) {
  const allPurchases = await prisma.purchase.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      productId: true,
    },
  })
  const purchase = await prisma.purchase.findFirst({
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
    purchase.status === 'Valid' || purchase.status === 'Restricted'
      ? await prisma.upgradableProducts.findMany({
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

  const existingPurchase = await prisma.purchase.findFirst({
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
}
