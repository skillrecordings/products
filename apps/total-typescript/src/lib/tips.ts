import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const TipSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _createdAt: z.string().optional(),
  _updatedAt: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  stackblitz: z.nullable(z.string()).optional(),
  muxPlaybackId: z.nullable(z.string()).optional(),
  videoResourceId: z.nullable(z.string()).optional(),
  transcript: z.nullable(z.string()).optional(),
  tweetId: z.string(),
})

export const TipsSchema = z.array(TipSchema)

export type Tip = z.infer<typeof TipSchema>

export const getAllTips = async (): Promise<Tip[]> => {
  const tips =
    await sanityClient.fetch(groq`*[_type == "tip"] | order(_createdAt asc) {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        description,
        summary,
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId
  }`)

  return TipsSchema.parse(tips)
}

export const getTip = async (slug: string): Promise<Tip | undefined> => {
  const tip = await sanityClient.fetch(
    groq`*[_type == "tip" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        title,
        description,
        summary,
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId
    }`,
    {slug: `${slug}`},
  )

  const parsedTip = TipSchema.safeParse(tip)

  return parsedTip.success ? parsedTip.data : undefined
}
