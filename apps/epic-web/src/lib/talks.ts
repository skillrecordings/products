import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {pickBy} from 'lodash'
import {getCurrentAbility} from '@skillrecordings/skill-lesson'
import {type User} from '@skillrecordings/database'

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
})

export const TalksSchema = z.array(TalkSchema)

export type Talk = z.infer<typeof TalkSchema>

export const getAllTalks = async (onlyPublished = true): Promise<Talk[]> => {
  const talks = await sanityClient.fetch(groq`*[_type == "talk" ${
    onlyPublished ? `&& state == "published"` : ''
  }] | order(_createdAt asc) {
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
        "tweetId":  resources[@._type == 'tweet'][0].tweetId
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
        "slug": slug.current,
        "legacyTranscript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "transcript": resources[@->._type == 'videoResource'][0]-> transcript.text,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId
    }`,
    {slug},
  )

  return TalkSchema.parse(pickBy(talk))
}

type GetTalkVideoForDeviceProps = {
  talkSlug: string
  user?: User
}
export async function getTalkVideoForDevice({
  talkSlug,
  user,
}: GetTalkVideoForDeviceProps) {
  const talk = await getTalk(talkSlug)
  const ability = getCurrentAbility({
    user,
    lesson: talk,
  })

  if (ability.can('view', 'Content')) {
    return {
      title: talk.title,
      description: talk.description,
      summary: talk.summary,
      muxPlaybackId: talk.muxPlaybackId,
      transcript: talk.transcript,
    }
  }
}
