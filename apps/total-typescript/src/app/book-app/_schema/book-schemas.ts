import z from 'zod'
import {ChapterSchema} from '@/lib/chapters'

export const BookSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  moduleType: z.literal('book'),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  chapters: z.array(
    ChapterSchema.extend({
      firstResource: z.object({
        _id: z.string(),
        slug: z.object({
          current: z.string(),
        }),
        title: z.string(),
      }),
    }),
  ),
})

export type Book = z.infer<typeof BookSchema>
export const ChapterListSchema = z.array(
  z.object({
    title: z.string(),
    slug: z.object({
      current: z.string(),
    }),
    resources: z
      .array(
        z.object({
          title: z.string(),
          slug: z.object({
            current: z.string(),
          }),
          solution: z.string().optional().nullable(),
        }),
      )
      .optional()
      .nullable(),
  }),
)

export type ChapterList = z.infer<typeof ChapterListSchema>
