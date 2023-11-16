import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const PageSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  summary: z.nullable(z.string()).optional(),
  body: z.nullable(z.string()).optional(),
  state: z.enum(['published', 'draft']),
  image: z
    .object({
      width: z.number(),
      height: z.number(),
      secure_url: z.string(),
    })
    .partial()
    .optional()
    .nullable(),
  ogImage: z
    .object({
      secure_url: z.string(),
    })
    .partial()
    .optional()
    .nullable(),
  resources: z.any().array().nullable(),
})

export const PagesSchema = z.array(PageSchema)

export type Page = z.infer<typeof PageSchema>

export const getPage = async (slug: string): Promise<Page | null> => {
  const page = await sanityClient.fetch(
    groq`*[_type == "page" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        "slug": slug.current,
        description,
        summary,
        body,
        image,
        ogImage,
        resources[]->{
          ...
        }
    }`,
    {slug: `${slug}`},
  )
  if (page) {
    return PageSchema.parse(page)
  } else {
    return null
  }
}
