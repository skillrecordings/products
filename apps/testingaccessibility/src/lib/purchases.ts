import prisma from '../db'
import {PurchaseStatus} from '../utils/purchase-status'
import {Purchase} from '../../generated/prisma/client'

export async function updatePurchaseStatusForCharge(
  chargeId: string,
  status: PurchaseStatus,
): Promise<Purchase | undefined> {
  const purchase = await prisma.purchase.findFirst({
    where: {
      merchantCharge: {
        identifier: chargeId,
      },
    },
  })

  if (purchase) {
    return await prisma.purchase.update({
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
    purchase.status === PurchaseStatus.Valid
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
      status: PurchaseStatus.Valid,
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
