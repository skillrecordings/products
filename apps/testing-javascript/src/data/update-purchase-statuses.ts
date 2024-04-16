// Running this script:
//
// Ensure you have the `PURCHASE_DATA_IMPORT_FILE_PATH` env var (in
// `.env.local`) set to the location of the TJS purchase data JSON export.
//
// Execute the Purchase Import like so:
//
// ```
// npx ts-node --files --skipProject src/data/update-purchase-statuses.ts
// ```

import fs from 'fs'
import {z} from 'zod'
import {prisma} from '@skillrecordings/database'

require('dotenv-flow').config({
  default_node_env: 'development',
})

const dataFilePath = z
  .string()
  .parse(process.env.PURCHASE_DATA_IMPORT_FILE_PATH)

const readJsonData = (path: string) => {
  let fileData = fs.readFileSync(path)
  return JSON.parse(fileData.toString())
}

const buildCustomStringError = (key: string) => {
  return {
    required_error: `${key} is required`,
    invalid_type_error: `${key} must be a string`,
  }
}

const nullUserId = 'EFAEA7AA-2D37-481B-883E-E2D0DAF5ACD4' as string

const zDefaultString = (base: Zod.Schema, defaultValue: string) => {
  return base.nullish().transform((val) => val ?? defaultValue)
}

const PurchaseSchema = z
  .object({
    id: z.string(buildCustomStringError('id')),
    userId: zDefaultString(
      z.string(buildCustomStringError('userId')),
      nullUserId,
    ),
    createdAt: z.string(buildCustomStringError('createdAt')),
    totalAmount: z.coerce.number(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
    ip_address: z.string().nullable(),
    status: z.union([
      z.literal('Valid'),
      z.literal('Restricted'),
      z.literal('Refunded'),
      z.literal('Banned'),
    ]),
    productId: z.string(buildCustomStringError('productId')),
    couponId: z.string().nullable(),
    merchantChargeId: z.string().nullable(),
    upgradedFromId: z.string().nullable(),
    bulkCouponId: z.string().nullable(),
    redeemedBulkCouponId: z.string().nullable(),
    merchantPurchaseId: z.string().nullable(),
    quantity: z.number().nullable(),
  })
  .transform(({createdAt, merchantPurchaseId, ...rest}) => {
    return {
      createdAt: new Date(createdAt),
      merchantSessionId: merchantPurchaseId,
      ...rest,
    }
  })

const MerchantChargeSchema = z
  .object({
    id: z.string(buildCustomStringError('id')),
    status: z.number(buildCustomStringError('status')),
    identifier: z.string(buildCustomStringError('identifier')),
    userId: zDefaultString(
      z.string(buildCustomStringError('userId')),
      nullUserId,
    ),
    merchantAccountId: z.string(buildCustomStringError('merchantAccountId')),
    merchantProductId: z.string(buildCustomStringError('merchantProductId')),
    merchantCustomerId: z.string().nullable(),
  })
  .transform((merchantCharge) => {
    return {
      ...merchantCharge,
      merchantCustomerId: merchantCharge.merchantCustomerId || undefined,
    }
  })

const updatePurchaseStatuses = async () => {
  // Make sure this only gets run against the KCD Products database
  if (process.env.DATABASE_URL !== 'mysql://root@localhost:3309/kcd-products') {
    console.log('This is only meant to run against the kcd-products database.')
    process.exit(1)
  }

  // ***************************************
  // ** Read and Parse Full Purchase JSON **
  // ***************************************

  const jsonData = readJsonData(dataFilePath)

  const purchases = PurchaseSchema.array().parse(jsonData['purchases'])
  const merchantCharges = MerchantChargeSchema.array().parse(
    jsonData['merchantCharges'],
  )

  const restrictedPurchases = purchases.filter((purchase) => {
    return purchase.status === 'Restricted'
  })

  // create an iterable object with restrictedPurchases and merchantCharges where each purchase has a merchantCharge
  const purchasesWithMerchantCharge = restrictedPurchases.map((purchase) => {
    return {
      purchase,
      merchantCharge: merchantCharges.find(
        (mc) => mc.id === purchase.merchantChargeId,
      ),
    }
  })

  let recordsProcessed = 0
  let recordsUpdated = 0

  for (const data of purchasesWithMerchantCharge) {
    recordsProcessed++

    if (recordsProcessed % 100 === 0) {
      console.log('@')
    } else {
      process.stdout.write('.')
    }

    const {purchase, merchantCharge} = data

    if (!purchase || !merchantCharge) {
      continue
    }

    const merchantChargeResult = await prisma.merchantCharge.findFirst({
      where: {
        identifier: merchantCharge.identifier,
      },
    })

    if (!merchantChargeResult) {
      continue
    }

    const purchaseResult = await prisma.purchase.findFirst({
      where: {
        merchantChargeId: merchantChargeResult.id,
      },
    })

    if (purchaseResult) {
      const {id} = purchaseResult

      await prisma.purchase.update({
        where: {
          id,
        },
        data: {
          status: purchase.status,
        },
      })

      recordsUpdated++
    }
  }

  console.log({recordsProcessed, recordsUpdated})
}

updatePurchaseStatuses()
