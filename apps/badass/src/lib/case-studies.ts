import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const CaseStudySchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  partnerName: z.string(),
  publishedDate: z.string(),
  ogImage: z.nullable(z.string()).optional(),
  heroImage: z.nullable(z.string()).optional(),
  cardImage: z.nullable(z.string()).optional(),
  description: z.nullable(z.string()).optional(),
  video: z
    .array(
      z.object({
        muxPlaybackId: z.string(),
        transcript: z.array(z.any()).nullable(),
      }),
    )
    .optional()
    .nullable(),
  body: z.any().array().nullable().optional(),
  markdownBody: z.string(),
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
        partnerName,
        publishedDate,
        title,
        state,
        description,
        "heroImage": heroImage.url,
        "cardImage": cardImage.url,
        "ogImage": ogImage.url,
        summary,
        markdownBody
  }`)
  return CaseStudiesSchema.parse(caseStudies)
}

export const getCaseStudy = async (slug: string): Promise<CaseStudy> => {
  const caseStudy = await sanityClient.fetch(
    groq`*[_type == "caseStudy" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        "slug": slug.current,
        partnerName,
        publishedDate,
        title,
        state,
        description,
        "heroImage": heroImage.url,
        "cardImage": cardImage.url,
        "ogImage": ogImage.url,
        summary,
        "video": resources[@->._type == 'videoResource']-> {
          "transcript": castingwords.transcript,
          "muxPlaybackId": muxAsset.muxPlaybackId
        },
        markdownBody,
        body[]{
        ...,
        markDefs[]{
          ...,
        },
        _type == "bodyClientProfile" => {
          ...,
          "image": image.asset->url
        },
        _type == "bodyContributorProfile" => {
          ...,
          "image": image.asset->url
        },
        _type == 'bodyGrid' => {
            ...,
            items[]{
              _type == "bodyClientProfile" => {
                ...,
                "image": image.asset->url
              },
              _type == "bodyContributorProfile" => {
                ...,
                "image": image.asset->url
              },
          }
        }
      },
    }`,
    {slug},
  )
  return CaseStudySchema.parse(caseStudy)
}
