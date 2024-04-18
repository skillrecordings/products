import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {pickBy} from 'lodash'
import {ContributorSchema} from './contributors'

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
  event: z
    .object({
      title: z.string(),
      slug: z.string(),
      state: z.enum(['draft', 'published']),
    })
    .nullable()
    .optional(),
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
  presenter: ContributorSchema.optional().nullable(),
})

export const TalksSchema = z.array(TalkSchema)

export type Talk = z.infer<typeof TalkSchema>

export const getRelatedTalks = async (
  talk: Talk,
  count: number,
): Promise<Talk[]> => {
  const talks = await sanityClient.fetch(
    groq`*[_type == "talk" && references(^._id)][0...${count}] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        description,
        summary,
        body,
        "event": *[_type == "event" && references(^._id)][0] {
          title,
          "slug": slug.current,
          state,
        },
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][
          0
        ]->castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId,
        "presenter": contributors[@.role == 'presenter'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
        },
    }`,
    talk,
  )
  return TalksSchema.parse(talks)
}

export const getAllTalks = async (
  onlyPublished = true,
  limit?: number,
): Promise<Talk[]> => {
  const talks = await sanityClient.fetch(groq`*[_type == "talk" ${
    onlyPublished ? `&& state == "published"` : ''
  }][${limit ? `0...${limit}` : ''}] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        description,
        summary,
        body,
        "event": *[_type == "event" && references(^._id)][0] {
          title,
          "slug": slug.current,
          state,
        },
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId,
        "presenter": contributors[@.role == 'presenter'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
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
        "event": *[_type == "event" && references(^._id)][0] {
          title,
          "slug": slug.current,
          state,
        },
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "videoPosterUrl": resources[@->._type == 'videoResource'][0]->poster,
        "slug": slug.current,
        "legacyTranscript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "transcript": resources[@->._type == 'videoResource'][0]-> transcript.text,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId, 
        "presenter": contributors[@.role == 'presenter'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
        },
    }`,
    {slug},
  )

  return TalkSchema.parse(pickBy(talk))
}

export const getAllConf24Talks = async (count?: number): Promise<Talk[]> => {
  const event =
    await sanityClient.fetch(groq`*[_type == "event" && slug.current == "conf"][0] {
      "talks": events[@->._type == 'talk'][${count ? `0...${count}` : ''}]->{
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
        "transcript": resources[@->._type == 'videoResource'][0]->castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId,
        "presenter": contributors[@.role == 'presenter'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
        },
      }
  }`)
  if (!event) {
    return []
  }
  return event.talks
  // return TalksSchema.parse(event.talks)
}
