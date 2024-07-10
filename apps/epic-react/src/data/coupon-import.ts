// Running this script (Epic React):
//
// Ensure you have the `COUPON_DATA_IMPORT_FILE_PATH` env var (in
// `.env.local`) set to the location of the Epic React coupon data JSON
// export. Ensure the data file has been exported before attempting to
// run this script.
//
// Execute the Coupon Import like so:
//
// ```
// npx ts-node --files --skipProject src/data/coupon-import.ts
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

const dataFilePath = z.string().parse(process.env.COUPON_DATA_IMPORT_FILE_PATH)

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

const FileDataSchema = z.object({
  coupons: z.array(CouponSchema),
})

const importCouponData = async () => {
  // Make sure this only gets run against the KCD Products database
  if (process.env.DATABASE_URL !== 'mysql://root@localhost:3309/kcd-products') {
    console.log(`This is only meant to run against the kcd-products database.`)
    process.exit(1)
  }

  let dataToParse: any = {
    coupons: [],
  }
  const collectData = (streamResponse: any) => {
    let {coupons} = streamResponse.value

    dataToParse.coupons.push(...coupons)
  }

  const processData = async () => {
    let {coupons} = FileDataSchema.parse(dataToParse)

    const shortRun = false

    const chunkData = <T>(data: Array<T>): Array<T>[] => {
      const chunks = chunk(data, 1000)

      if (shortRun) {
        return chunks.slice(0, 1)
      } else {
        return chunks
      }
    }

    for (const couponChunk of chunkData(coupons)) {
      await prisma.coupon.createMany({data: couponChunk, skipDuplicates: true})
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

importCouponData()
