import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

export const searchRouter = router({
  resultsForQuery: publicProcedure
    .input(
      z.object({
        query: z.string(),
        resourceType: z.string().optional(),
        numResults: z.number().default(20),
      }),
    )
    .query(async ({ctx, input}) => {
      const {resourceType} = input
      const results = await sanityClient.fetch(
        `  *[_type in [${
          resourceType
            ? `"${resourceType}"`
            : '"article", "tip", "module", "exercise", "explainer", "talk"'
        }]]
    | score(
      title match $searchQuery 
      || _type match "module"
      || description match $searchQuery
      || pt::text(body) match $searchQuery
      || body match $searchQuery
      || boost(body match $searchQuery + "*", 0.5)
      || boost(pt::text(body) match $searchQuery + "*", 0.5)
      || boost(pt::text(transcript) match $searchQuery, 0.5)

    )
    | order(_score desc)
    {
      description,
      _score,
      _id,
      title,
      slug,
      _type,
      moduleType,
      "section": *[_type in ['section'] && references(^._id)][0]{
        _id,
        "slug": slug.current,
        title
      }
      
    } | {
      ...,
      "module": *[_type in ['module'] && references(^.section._id)][0] {
        _id,
        slug,
        title,
        moduleType
      }
    }
    [_score > 0][0..${input.numResults}]`,
        {searchQuery: input.query},
      )

      return results
    }),
})
