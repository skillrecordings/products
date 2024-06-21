import {getExercise} from '@/lib/exercises'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import {z} from 'zod'

export const exercisesRouter = router({
  getExerciseForBook: publicProcedure
    .input(
      z.object({
        resourceId: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {resourceId} = input
      const exercise = await sanityClient.fetch(
        groq`*[_type in ['exercise', 'explainer', 'interview'] && slug.current == $slugOrId || _id == $slugOrId][0]{
            _id,
            _type,
            _updatedAt,
            title,
            description,
            "slug": slug.current,
            body,
            "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
            "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
            "aiTranscript": resources[@->._type == 'videoResource'][0]-> transcript.text,
            "section": *[_type == 'section' && references(^._id)][0]{
                _id,
                "slug": slug.current,
                "workshop": *[_type == 'module' && references(^._id)][0]{
                    title
                },
            },
            "solution": resources[@._type == 'solution'][0]{
              _key,
              _type,
              "_updatedAt": ^._updatedAt,
              title,
              description,
              body,
              "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
              "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
              "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
              "aiTranscript": resources[@->._type == 'videoResource'][0]-> transcript.text,
              "slug": slug.current,
            }
          }`,
        {
          slugOrId: resourceId,
        },
      )

      return exercise
    }),
})
