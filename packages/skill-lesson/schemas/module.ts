import z from 'zod'
import {LessonResourceSchema, SolutionResourceSchema} from './lesson'
import {ExerciseSchema} from './exercise'
import {CollectionSchema} from './collection'
import {SectionSchema} from './section'
import {TestimonialSchema} from './testimonial'

export const ModuleSchema = z
  .object({
    _id: z.string().optional(),
    moduleType: z.string(),
    ogImage: z.string().nullish(),
    image: z.string().nullish(),
    product: z.object({productId: z.string(), name: z.string()}).nullish(),
    author: z
      .object({
        name: z.string(),
        slug: z.string(),
        twitterHandle: z.string().nullable(),
        image: z.string(),
        imageAlt: z.string().nullable(),
      })
      .nullable()
      .optional(),
    state: z
      .string()
      .or(z.enum(['published', 'draft']))
      .optional()
      .nullable(),
    cta: z
      .object({
        body: z.array(z.any()).or(z.string()).nullish(),
        expiresAt: z.string().nullish(),
      })
      .nullish(),
    github: z
      .object({
        repo: z.string().nullish(),
        title: z.string().optional().nullable(),
      })
      .nullish(),
    slug: z.object({
      current: z.string(),
    }),
    lessons: z
      .array(
        z.intersection(
          LessonResourceSchema,
          SolutionResourceSchema,
          ExerciseSchema,
        ),
      )
      .nullish(),
    sections: z.array(SectionSchema).nullish(),
    testimonials: z.array(TestimonialSchema).nullish(),
  })
  .merge(CollectionSchema.omit({slug: true}))

export type Module = z.infer<typeof ModuleSchema>
