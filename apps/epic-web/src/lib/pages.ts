import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'
import {z} from 'zod'

export const PageSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  body: z.nullable(z.string()).optional(),
})

export const PagesSchema = z.array(PageSchema)

export type Page = z.infer<typeof PageSchema>

export async function getAllPages() {
  const pages =
    await sanityClient.fetch(groq`*[_type == "page"] | order(date asc){
    _type,
    _updatedAt,
    _id,
    _updatedAt,
    _createdAt,
    title,
    'slug': slug.current,
    description,
    body
}`)
  return PagesSchema.parse(pages)
}

export async function getPage(slug: string) {
  const page = await sanityClient.fetch(
    groq`*[_type == "page" && slug.current == $slug][0]{
    _type,
    _updatedAt,
    _id,
    _updatedAt,
    _createdAt,
    title,
    "slug": slug.current,
    body,
    description
    }`,
    {
      slug,
    },
  )
  return PageSchema.parse(page)
}
