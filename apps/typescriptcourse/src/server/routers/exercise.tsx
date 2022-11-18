import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {Lesson, LessonSchema} from '../../lib/lesson'

export const exerciseRouter = createRouter().query('bySlug', {
  input: z.object({
    slug: z.string(),
  }),
  async resolve({ctx, input}) {
    const lesson: Lesson = await sanityClient.fetch(
      groq`*[_type == "lesson" && slug.current == $slug][0]`,
      {slug: input.slug},
    )
    return LessonSchema.parse(lesson)
  },
})
