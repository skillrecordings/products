// Running this script:
//
// Run the following commands from 'apps/testingaccessibility'.
//
// First, open a connection to the planetscale database and branch:
//
// ```
// pscale connect testing-accessbility <branch-name> --port 3309 --host "::1"
// ```
//
// Execute the data migration:
//
// ```
// npx ts-node --skipProject src/data/migrate-redeemed-bulk-coupon.ts
// ```

import {prisma} from '../../../../packages/database/src/client'

const copyOverCouponIdToRedeemedCouponId = async () => {
  // Make sure this only runs for the expected database, because TA is the only
  // DB that has purchases that need migrating.
  if (
    process.env.DATABASE_URL !==
    'mysql://root@localhost:3309/testing-accessibility'
  ) {
    console.log(
      'This is only meant to run against the testing-accessibility database.',
    )
    process.exit(1)
  }

  const purchaseCount = await prisma.purchase.count()
  const purchasesThatNeedUpdating = await prisma.purchase.findMany({
    where: {redeemedBulkCouponId: null, couponId: {not: null}},
  })

  console.log(
    `Need to update ${purchasesThatNeedUpdating.length} of ${purchaseCount} purchases.`,
  )

  for (const purchaseToUpdate of purchasesThatNeedUpdating) {
    await prisma.purchase.update({
      where: {
        id: purchaseToUpdate.id,
      },
      data: {
        redeemedBulkCouponId: purchaseToUpdate.couponId,
      },
    })
  }

  const afterPurchasesThatNeedUpdating = await prisma.purchase.findMany({
    where: {redeemedBulkCouponId: null, couponId: {not: null}},
  })

  const numberUpdated =
    purchasesThatNeedUpdating.length - afterPurchasesThatNeedUpdating.length
  console.log(`Successfully updated ${numberUpdated} purchases`)
}

copyOverCouponIdToRedeemedCouponId()
