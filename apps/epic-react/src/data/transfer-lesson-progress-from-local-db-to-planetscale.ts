// Running this script (Epic React):
//
// TODO: Update these details!!!
// Ensure you have the `PURCHASE_DATA_IMPORT_FILE_PATH` env var (in
// `.env.local`) set to the location of the Epic React purchase data JSON
// export. If this file hasn't been exported yet, follow the instructions here:
// https://github.com/skillrecordings/egghead-rails/blob/main/docs/export-kcd-products-data.md
//
// Execute the Purchase Import like so:
//
// ```
// npx ts-node --files --skipProject src/data/transfer-lesson-progress-from-local-db-to-planetscale.ts
// ```

import fs from 'fs'
import {z} from 'zod'
import chunk from 'lodash/chunk'
import {prisma as localPrismaClient} from '@skillrecordings/database'
import {PrismaClient} from '@prisma/client'

const startingPointFile = './starting-point.txt'

const pscaleUrl = 'mysql://root@localhost:3399/kcd-products'

const pscalePrismaClient = new PrismaClient({
  datasources: {db: {url: pscaleUrl}},
})

require('dotenv-flow').config({
  default_node_env: 'development',
})

const LessonProgressRecordsSchema = z.array(
  z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    lessonId: z.string(),
    sectionId: z.string().nullable(),
    moduleId: z.string().nullable(),
    lessonSlug: z.string(),
    lessonVersion: z.coerce.string(),
    completedAt: z
      .date()
      .nullable()
      .transform((val) => {
        if (val === null) {
          return val
        }
        return val.toISOString()
      }),
    updatedAt: z.date().transform((val) => {
      return val.toISOString()
    }),
    createdAt: z.date().transform((val) => {
      return val.toISOString()
    }),
  }),
)

type LessonProgressRecords = z.infer<typeof LessonProgressRecordsSchema>
type Options = {
  startingPoint: string | undefined
  startingCursor: number | undefined
  currentPoint: string
}

const chunkRecords = <T>(records: Array<T>): Array<[Array<T>, number]> => {
  // const indexer = <T>(
  //   result: Array<[Array<T>, number]>,
  //   value: Array<T>,
  //   index: number,
  // ) => {
  //   const tuple: [Array<T>, number] = [value, index]
  //   return [...result, tuple]
  // }

  // return reduce(chunk(records, 1000), indexer, [])
  return chunk(records, 1000).map((recordChunk, index) => [recordChunk, index])
}

const createManyInChunks = async (
  records: LessonProgressRecords,
  options: Options,
) => {
  let startingCursor = 0
  // only use the cursor for the startingPoint (date) that the cursor was set for
  if (
    options.currentPoint === options.startingPoint &&
    options.startingCursor
  ) {
    startingCursor = options.startingCursor
  }

  let cursor = startingCursor
  let createCount = 0

  try {
    for (const [recordChunk, index] of chunkRecords(records)) {
      if (cursor > index) {
        continue
      }

      const createResult = await pscalePrismaClient.lessonProgress.createMany({
        data: recordChunk,
        skipDuplicates: true,
      })

      createCount += createResult.count

      cursor += 1
    }
  } catch (e) {
    console.log(`Error: ${e}`)

    return {status: 'failure' as const, cursor, count: createCount}
  }

  return {status: 'success' as const, count: createCount}
}

const transferLessonProgress = async () => {
  // Make sure this only gets run against the KCD Products database
  if (
    !process.env.DATABASE_URL?.includes(
      'mysql://root@localhost:3309/kcd-products',
    )
  ) {
    console.log('This is only meant to run against the kcd-products database.')
    process.exit(1)
  }

  // read the DATE TO START WITH file, if there is a date, skip ahead to it,
  // otherwise start at the beginning.
  const fileExists = Boolean(
    fs.statSync(startingPointFile, {throwIfNoEntry: false}),
  )
  let startingPoint = undefined
  let startingCursor = undefined

  if (fileExists) {
    const startingData = fs
      .readFileSync(startingPointFile)
      .toString()
      .split(',')
    startingPoint = startingData[0]
    startingCursor = Number.parseInt(startingData[1])
  }

  if (startingPoint) {
    console.log(`The starting point is: ${startingPoint}`)
  } else {
    console.log('No starting point, start at beginning')
  }

  const datesWithProgress = z
    .array(
      z.object({date: z.coerce.string()}).transform(({date}) => {
        return {date: new Date(date).toISOString().slice(0, 10)}
      }),
    )
    .parse(
      await localPrismaClient.$queryRaw`
        select date(createdAt) as date
          from LessonProgress
        group by date(createdAt)
        order by date(createdAt) asc;
      `,
    )

  console.log(`There are ${datesWithProgress.length} dates to process`)

  for (const dateWithProgress of datesWithProgress) {
    // if we have a starting point, then there are dates we have already
    // processed that we can skip past.
    if (!!startingPoint && dateWithProgress.date < startingPoint) {
      continue
    }

    console.log(`- Now processing ${dateWithProgress.date}`)

    try {
      const recordsForGivenDate: any = await localPrismaClient.$queryRaw`
        select *
          from LessonProgress
        where date(createdAt) = ${dateWithProgress.date}
        order by createdAt asc;
      `

      const parsedLessonProgressRecords =
        LessonProgressRecordsSchema.parse(recordsForGivenDate)

      console.log(
        `  there are ${parsedLessonProgressRecords.length} for this date`,
      )

      const options = {
        startingCursor,
        startingPoint,
        currentPoint: dateWithProgress.date,
      }

      const createResult = await createManyInChunks(
        parsedLessonProgressRecords,
        options,
      )

      console.log(`  created ${createResult.count} new records`)

      if (createResult.status === 'failure') {
        console.log(
          `  failed during batch inserts at cursor ${createResult.cursor}`,
        )

        fs.writeFileSync(
          startingPointFile,
          `${dateWithProgress.date},${createResult.cursor || 0}`,
        )

        process.exit(1)
      }

      // if this succeeds, great continue,
      // if it fails, record the date because we want to pick up where we left off
    } catch (e) {
      console.log(`Error: ${e}`)

      // write this to a file
      fs.writeFileSync(startingPointFile, dateWithProgress.date)

      throw e
    }
  }
}

transferLessonProgress()
