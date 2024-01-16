// Running this script (Epic React):
//
// Ensure you have the `LESSON_PROGRESS_DATA_IMPORT_FILE_PATH` env var (in
// `.env.local`) set to the location of the Epic React lesson progress data
// JSON export. If this file hasn't been exported yet, follow the instructions
// here:
// https://github.com/skillrecordings/egghead-rails/blob/main/docs/export-kcd-products-data.md
//
// Execute the Lesson Progress Import like so:
//
// ```
// npx ts-node --files --skipProject src/data/lesson-progress-import.ts
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
  .parse(process.env.LESSON_PROGRESS_DATA_IMPORT_FILE_PATH)

const LessonProgressSchema = z
  .object({
    id: z.string(),
    userId: z.string().nullable(),
    lessonSlug: z.string(),
    lessonVersion: z.coerce.string(),
    completedAt: z.string().nullable(),
    updatedAt: z.string(),
    createdAt: z.string(),
    lessonId: z.string(),
  })
  .transform(({createdAt, updatedAt, completedAt, ...rest}) => {
    return {
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
      completedAt: completedAt && new Date(completedAt),
      ...rest,
    }
  })

// from: https://github.com/sindresorhus/type-fest/blob/main/source/set-non-nullable.d.ts
type SetNonNullable<BaseType, Keys extends keyof BaseType = keyof BaseType> = {
  [Key in keyof BaseType]: Key extends Keys
    ? NonNullable<BaseType[Key]>
    : BaseType[Key]
}

type LessonProgress = z.infer<typeof LessonProgressSchema>
type ValidLessonProgress = SetNonNullable<LessonProgress, 'userId'>

const FileDataSchema = z.object({
  lessonProgress: z.array(LessonProgressSchema),
})

const importLessonProgressData = async () => {
  // Make sure this only gets run against the KCD Products database
  if (process.env.DATABASE_URL !== 'mysql://root@localhost:3309/kcd-products') {
    console.log('This is only meant to run against the kcd-products database.')
    process.exit(1)
  }

  // ***************************************
  // ** Read and Parse Full Purchase JSON **
  // ***************************************

  const processData = async (dataToParse: any) => {
    let {lessonProgress} = FileDataSchema.parse(dataToParse)

    const shortRun = false

    const chunkData = <T>(data: Array<T>): Array<T>[] => {
      const chunks = chunk(data, 1000)

      if (shortRun) {
        return chunks.slice(0, 1)
      } else {
        return chunks
      }
    }

    for (const lessonProgressChunk of chunkData(lessonProgress)) {
      const validLessonProgressRecords =
        lessonProgressChunk.filter<ValidLessonProgress>(
          (lessonProgress): lessonProgress is ValidLessonProgress => {
            return lessonProgress.userId !== null
          },
        )
      await prisma.lessonProgress.createMany({
        data: validLessonProgressRecords,
        skipDuplicates: true,
      })
    }
  }

  const collectData = async (data: any) => {
    await processData(data.value)
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
  pipeline.on('end', () => console.log('Done streaming this JSON file'))
  // ---------------------------------------
}

importLessonProgressData()
