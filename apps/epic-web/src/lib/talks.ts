import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {pickBy} from 'lodash'

export const TalkSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  _createdAt: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  muxPlaybackId: z.nullable(z.string()).optional(),
  videoPosterUrl: z.nullable(z.string()).optional(),
  state: z.enum(['new', 'processing', 'reviewing', 'published', 'retired']),
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
  videoResourceId: z.nullable(z.string()).optional(),
  transcript: z.nullable(z.string()).optional(),
  tweetId: z.nullable(z.string()).optional(),
  author: z
    .object({
      name: z.string(),
      slug: z.string(),
      image: z.string(),
      imageAlt: z.string(),
    })
    .nullable()
    .optional(),
})

export const TalksSchema = z.array(TalkSchema)

export type Talk = z.infer<typeof TalkSchema>

export const getAllTalks = async (onlyPublished = true): Promise<Talk[]> => {
  const talks = await sanityClient.fetch(groq`*[_type == "talk" ${
    onlyPublished ? `&& state == "published"` : ''
  }] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        description,
        summary,
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId,
        author-> {
          name,
          "slug": slug.current,
          "image": picture.asset->url,
          "imageAlt": picture.alt
        },
  }`)

  return TalksSchema.parse(talks)
}

export const getTalk = async (slug: string): Promise<Talk> => {
  const talk = await sanityClient.fetch(
    groq`*[_type == "talk" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        description,
        summary,
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "videoPosterUrl": resources[@->._type == 'videoResource'][0]->poster,
        "slug": slug.current,
        "legacyTranscript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "transcript": resources[@->._type == 'videoResource'][0]-> transcript.text,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId, 
        author-> {
          name,
          "slug": slug.current,
          "image": picture.asset->url,
          "imageAlt": picture.alt
        },
    }`,
    {slug},
  )

  return TalkSchema.parse(pickBy(talk))
}
