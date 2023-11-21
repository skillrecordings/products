import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'

export const getLesson = async (
  slug: string,
  includeMedia: boolean = true,
): Promise<any> => {
  const lesson = await sanityClient.fetch(
    `*[_type in ['explainer'] && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      body,
      "section": *[_type in ['section'] && references(^._id)][0]{
        _id,
        "slug": slug.current,
        title
      },
      ...resources[@->._type == 'videoResource'][0]-> {
        "videoResourceId": _id,
        "durationInSeconds": duration,
        "transcript": castingwords.transcript
      },
    } | {
      ...,
      "module": *[_type in ['module'] && references(^.section._id)][0] {
        _id,
        slug,
        title
      }
    }`,
    {slug},
  )

  return lesson
}

export const getAllLessons = async (): Promise<any[]> => {
  const lessons = await sanityClient.fetch(groq`*[_type in ['explainer']]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      "slug": slug.current,
      ...resources[@->._type == 'videoResource'][0]-> {
        "videoResourceId": _id,
        "durationInSeconds": duration
      },
    }`)

  return lessons
}
