import {prisma} from '@skillrecordings/database'

export async function getUser(userId: string) {
  return prisma.user.findUnique({
    where: {id: userId},
    select: {
      roles: true,
      id: true,
      name: true,
      email: true,
      image: true,
      purchases: {
        select: {
          id: true,
          status: true,
          country: true,
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
