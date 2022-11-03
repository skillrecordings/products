import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const ExerciseSchema = z.object({
  _id: z.string().optional(),
  _key: z.string().optional(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.any().array().optional(),
  stackblitz: z.nullable(z.string()).optional(),
  muxPlaybackId: z.nullable(z.string()).optional(),
  transcript: z.nullable(z.any().array()).optional(),
  solution: z
    .object({
      _key: z.string(),
      _type: z.string(),
      _updatedAt: z.string().optional(),
      title: z.string(),
      slug: z.string(),
      description: z.nullable(z.string()).optional(),
      body: z.any().array().optional(),
      stackblitz: z.nullable(z.string()).optional(),
      muxPlaybackId: z.nullable(z.string()).optional(),
      transcript: z.nullable(z.any().array()).optional(),
    })
    .optional(),
})

export type Exercise = z.infer<typeof ExerciseSchema>

export const getExerciseMuxPlaybackId = async (exerciseSlug: string) => {
  const exerciseVideo = await sanityClient.fetch(
    `
  *[_type == "exercise" && slug.current == $slug][0]
    .resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId`,
    {slug: `${exerciseSlug}`},
  )

  return z.string().nullish().parse(exerciseVideo)
}

export const getExerciseMedia = async (exerciseSlug: string) => {
  const exerciseMedia = await sanityClient.fetch(
    groq`*[_type == "exercise" && slug.current == $slug][0]{
      "slug": slug.current,
      body,
      "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
      "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      "solution": resources[@._type == 'solution'][0]{
        body,
        "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "slug": slug.current,
      }
    }`,
    {slug: `${exerciseSlug}`},
  )

  return exerciseMedia
}

export const getExercise = async (
  slug: string,
  includeMedia: boolean = true,
): Promise<Exercise> => {
  const query = groq`*[_type == "exercise" && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      ${
        includeMedia
          ? `      
        body,
        "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      `
          : ''
      }
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        ${
          includeMedia
            ? `      
          body,
          "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
          "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
          "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        `
            : ''
        }
        "slug": slug.current,
      }
    }`

  const exercise = await sanityClient.fetch(query, {slug: `${slug}`})

  return ExerciseSchema.parse(exercise)
}

export const getAllExercises = async (): Promise<Exercise[]> => {
  const exercises = await sanityClient.fetch(groq`*[_type == "exercise"]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      "slug": slug.current,
      "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
      "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        _updatedAt,
        title,
        description,
        body,
        "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
       "slug": slug.current
       }
    }`)

  return z.array(ExerciseSchema).parse(exercises)
}
