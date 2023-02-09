import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const CaseStudySchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  image: z.nullable(z.string()).optional(),
  description: z.nullable(z.string()).optional(),
  body: z.any().array().nullable().optional(),
  summary: z.any().array().nullable().optional(),
  state: z.enum(['published', 'draft']),
})

export const CaseStudiesSchema = z.array(CaseStudySchema)

export type CaseStudy = z.infer<typeof CaseStudySchema>

export const getAllCaseStudies = async (): Promise<CaseStudy[]> => {
  const caseStudies =
    await sanityClient.fetch(groq`*[_type == "caseStudy"] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        "slug": slug.current,
        title,
        state,
        description,
        "image": image.asset->url,
        summary,
        body
  }`)

  return CaseStudiesSchema.parse(caseStudies)
}

export const getCaseStudy = async (
  slug: string,
): Promise<CaseStudy | undefined> => {
  const caseStudy = await sanityClient.fetch(
    groq`*[_type == "caseStudy" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        "slug": slug.current,
        title,
        state,
        description,
        "image": image.asset->url,
        summary,
        body
    }`,
    {slug: `${slug}`},
  )
  if (!caseStudy) {
    return undefined
  }
  return CaseStudySchema.parse(caseStudy)
}
