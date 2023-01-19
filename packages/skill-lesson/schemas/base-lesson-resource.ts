import z from 'zod'

export const BaseLessonResourceSchema = z.object({
  _type: z.string(),
  _updatedAt: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.nullable(z.any().array().optional()),
  solution: z
    .nullable(
      z.object({
        _key: z.string(),
        videoResourceId: z.nullable(z.string()).optional(),
        transcript: z.nullable(z.any().array()).optional(),
        github: z
          .object({
            url: z.string(),
          })
          .optional()
          .nullable(),
      }),
    )
    .optional(),
})
