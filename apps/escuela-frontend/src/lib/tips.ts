import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const TipSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  _createdAt: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.any().array().nullable().optional(),
  summary: z.any().array().nullable().optional(),
  sandpack: z
    .array(
      z.object({
        file: z.string(),
        code: z.string(),
        active: z.boolean(),
      }),
    )
    .optional()
    .nullable(),
  muxPlaybackId: z.nullable(z.string()).optional(),
  transcript: z.nullable(z.any().array()),
  tweetId: z.string(),
  author: z.object({
    name: z.string().optional(),
    twitter: z.string().optional(),
    image: z.string(),
  }),
})

export const TipsSchema = z.array(TipSchema)

export type Tip = z.infer<typeof TipSchema>

export const getAllTips = async (): Promise<Tip[]> => {
  const tips =
    await sanityClient.fetch(groq`*[_type == "tip"] | order(_createdAt asc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        description,
        summary,
        body,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId,
        author[0]->{
          'name': name, 
          'twitter': twitter, 
          'image': image.url
        },
  }`)

  return TipsSchema.parse(tips)
}

export const getTip = async (slug: string): Promise<Tip> => {
  const tip = await sanityClient.fetch(
    groq`*[_type == "tip" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        description,
        summary,
        body,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId,
        author[0]->{
          'name': name, 
          'twitter': twitter, 
          'image': image.url
        },
    }`,
    {slug: `${slug}`},
  )

  return TipSchema.parse(tip)
}
