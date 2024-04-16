// Running this script (Epic React):
//
// Ensure you have the `PURCHASE_DATA_IMPORT_FILE_PATH` env var (in
// `.env.local`) set to the location of the Epic React purchase data JSON
// export. If this file hasn't been exported yet, follow the instructions here:
// https://github.com/skillrecordings/egghead-rails/blob/main/docs/export-kcd-products-data.md
//
// Execute the Purchase Import like so:
//
// ```
// npx ts-node --files --skipProject src/data/purchase-import.ts
// ```

import fs from 'fs'
import {z} from 'zod'
import chunk from 'lodash/chunk'
import {prisma} from '@skillrecordings/database'

import {chain} from 'stream-chain'
import {parser} from 'stream-json'
import {streamValues} from 'stream-json/streamers/StreamValues'

require('dotenv-flow').config({
  default_node_env: 'development',
})

const dataFilePath = z
  .string()
  .parse(process.env.PURCHASE_DATA_IMPORT_FILE_PATH)

const now = new Date().toISOString()

const UserSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
    role: z.string().nullable(),
  })
  .transform((user) => {
    const {role, emailVerified, ...rest} = user
    return {
      ...rest,
      emailVerified: emailVerified ? now : undefined,
      roles: role || undefined,
    }
  })

const CouponSchema = z
  .object({
    id: z.string(),
    code: z.string(),
    createdAt: z.string(),
    expires: z.string().nullable(),
    maxUses: z.number().nullable(),
    default: z.boolean(),
    merchantCouponId: z.string().nullable(),
    status: z.number(),
    usedCount: z.number(),
    percentageDiscount: z.string(),
    restrictedToProductId: z.string().nullable(),
    bulkPurchaseId: z.string().nullable(),
  })
  .transform((coupon) => {
    return {
      ...coupon,
      percentageDiscount: Number.parseFloat(coupon.percentageDiscount),
      maxUses: coupon.maxUses || undefined,
    }
  })
  .transform(({createdAt, expires, ...rest}) => {
    return {
      createdAt: new Date(createdAt),
      expires: expires && new Date(expires),
      ...rest,
    }
  })

const MerchantCustomerSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    merchantAccountId: z.string(),
    identifier: z.string(),
    createdAt: z.string(),
    status: z.number(),
  })
  .transform(({createdAt, ...rest}) => {
    return {
      createdAt: new Date(createdAt),
      ...rest,
    }
  })

const MerchantChargeSchema = z
  .object({
    id: z.string(),
    status: z.number(),
    identifier: z.string(),
    userId: z.string(),
    merchantAccountId: z.string(),
    merchantProductId: z.string(),
    merchantCustomerId: z.string().nullable(),
  })
  .transform((merchantCharge) => {
    return {
      ...merchantCharge,
      merchantCustomerId: merchantCharge.merchantCustomerId || undefined,
    }
  })

type MerchantCharge = z.infer<typeof MerchantChargeSchema>

// from: https://github.com/sindresorhus/type-fest/blob/main/source/set-non-nullable.d.ts
type SetNonNullable<BaseType, Keys extends keyof BaseType = keyof BaseType> = {
  [Key in keyof BaseType]: Key extends Keys
    ? NonNullable<BaseType[Key]>
    : BaseType[Key]
}

type CleanMerchantCharge = SetNonNullable<MerchantCharge, 'merchantCustomerId'>

const PurchaseSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    createdAt: z.string(),
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
    productId: z.string(),
    couponId: z.string().nullable(),
    merchantChargeId: z.string().nullable(),
    upgradedFromId: z.string().nullable(),
    bulkCouponId: z.string().nullable(),
    redeemedBulkCouponId: z.string().nullable(),
    merchantPurchaseId: z.string().nullable(),
    // quantity: z.number().nullable(),
  })
  .transform(({createdAt, merchantPurchaseId, ...rest}) => {
    return {
      createdAt: new Date(createdAt),
      merchantSessionId: merchantPurchaseId,
      ...rest,
    }
  })

const FileDataSchema = z.object({
  users: z.array(UserSchema),
  coupons: z.array(CouponSchema),
  merchantCustomers: z.array(MerchantCustomerSchema),
  merchantCharges: z.array(MerchantChargeSchema),
  purchases: z.array(PurchaseSchema),
})

const importPurchaseData = async () => {
  // Make sure this only gets run against the KCD Products database
  if (process.env.DATABASE_URL !== 'mysql://root@localhost:3309/kcd-products') {
    console.log('This is only meant to run against the kcd-products database.')
    process.exit(1)
  }

  let dataToParse: any = {
    users: [],
    coupons: [],
    merchantCustomers: [],
    merchantCharges: [],
    purchases: [],
  }
  const collectData = (streamResponse: any) => {
    let {users, coupons, merchantCustomers, merchantCharges, purchases} =
      streamResponse.value

    dataToParse.users.push(...users)
    dataToParse.coupons.push(...coupons)
    dataToParse.merchantCustomers.push(...merchantCustomers)
    dataToParse.merchantCharges.push(...merchantCharges)
    dataToParse.purchases.push(...purchases)
  }

  const processData = async () => {
    let {users, coupons, merchantCustomers, merchantCharges, purchases} =
      FileDataSchema.parse(dataToParse)

    const shortRun = false

    const chunkData = <T>(data: Array<T>): Array<T>[] => {
      const chunks = chunk(data, 1000)

      if (shortRun) {
        return chunks.slice(0, 1)
      } else {
        return chunks
      }
    }

    // These UUIDs have no significance and aren't related to existing data. They
    // were generated to be used as a consistent ID value for the User and
    // Customer records.
    const nullUserId = 'EFAEA7AA-2D37-481B-883E-E2D0DAF5ACD4' as string
    const nullCustomerId = 'kcd_50A6E8C7-0ECA-43C1-848B-91080EAD7B4D' as string

    // Create a null customer if it doesn't already exist
    await prisma.user.upsert({
      where: {id: nullUserId},
      update: {},
      create: {
        name: 'Null Customer',
        email: 'nullcustomer@egghead.io',
        emailVerified: null,
      },
    })
    // Note: this references the `merchantAccountId` for the one _shared_ Stripe
    // merchant account, so it should be the same across KCD products.
    await prisma.merchantCustomer.upsert({
      where: {
        id: nullCustomerId,
      },
      update: {},
      create: {
        userId: nullUserId,
        merchantAccountId: 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e',
        identifier: 'cus_kcd_null_customer',
        createdAt: now,
        status: 0,
      },
    })

    for (const userChunk of chunkData(users)) {
      await prisma.user.createMany({data: userChunk, skipDuplicates: true})
    }

    for (const couponChunk of chunkData(coupons)) {
      await prisma.coupon.createMany({data: couponChunk, skipDuplicates: true})
    }

    for (const merchantCustomerChunk of chunkData(merchantCustomers)) {
      await prisma.merchantCustomer.createMany({
        data: merchantCustomerChunk,
        skipDuplicates: true,
      })
    }

    for (const merchantChargeChunk of chunkData(merchantCharges)) {
      const fillInNullCustomer = (
        merchantCharge: MerchantCharge,
      ): CleanMerchantCharge => {
        const validCustomerId =
          merchantCharge.merchantCustomerId || nullCustomerId

        return {
          ...merchantCharge,
          merchantCustomerId: validCustomerId,
        }
      }

      const cleanedMerchantChargeChunk =
        merchantChargeChunk.map(fillInNullCustomer)

      await prisma.merchantCharge.createMany({
        data: cleanedMerchantChargeChunk,
        skipDuplicates: true,
      })
    }

    for (const purchaseChunk of chunkData(purchases)) {
      await prisma.purchase.createMany({
        data: purchaseChunk,
        skipDuplicates: true,
      })
    }
  }

  // ---------------------------------------
  // Stream large file and parse to JSON
  const pipeline = chain([
    fs.createReadStream(dataFilePath),
    parser(),
    streamValues(),
  ])

  // Aggregate all the data and then process it (push to database)
  pipeline.on('data', collectData)
  pipeline.on('end', processData)
  // ---------------------------------------
}

importPurchaseData()
