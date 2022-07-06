import prisma from '../db'

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
    },
  })

  if (!purchase) {
    return {}
  }

  const availableUpgrades = await prisma.upgradableProducts.findMany({
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

  const existingPurchase = await prisma.purchase.findFirst({
    where: {
      userId,
      productId: purchase?.product?.id,
      id: {
        not: purchaseId as string,
      },
      bulkCoupon: null,
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
