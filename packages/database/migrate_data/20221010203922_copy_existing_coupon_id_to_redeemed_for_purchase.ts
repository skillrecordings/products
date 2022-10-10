// const {prisma} = require('../src/client')
import {prisma} from '../src/client'

const copyOverCouponIdToRedeemedCouponId = async () => {
  const purchaseCount = await prisma.purchase.count()
  const purchasesThatNeedUpdating = await prisma.purchase.findMany({
    where: {redeemedCouponId: null, couponId: {not: null}},
  })

  console.log(
    `Need to update ${purchasesThatNeedUpdating.length} of ${purchaseCount} purchases.`,
  )

  purchasesThatNeedUpdating.forEach(async (purchase) => {
    await prisma.purchase.update({
      where: {
        id: purchase.id,
      },
      data: {
        redeemedCouponId: purchase.couponId,
      },
    })
  })

  const afterPurchasesThatNeedUpdating = await prisma.purchase.findMany({
    where: {redeemedCouponId: null, couponId: {not: null}},
  })

  const numberUpdated =
    purchasesThatNeedUpdating.length - afterPurchasesThatNeedUpdating.length
  console.log(`Successfully updated ${numberUpdated} purchases`)
}

// copyOverCouponIdToRedeemedCouponId()
console.log({database_url: process.env.DATABASE_URL})

export {}
