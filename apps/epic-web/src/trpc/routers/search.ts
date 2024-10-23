import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

function getOrder(orderBy: (typeof searchQuerySchema)['_output']['orderBy']) {
  switch (orderBy) {
    case 'newest':
      return '_createdAt desc'
    default:
      return ''
  }
}

const searchQuerySchema = z.object({
  query: z.string(),
  resourceType: z.string().optional(),
  moduleTypes: z.array(z.string()).optional(),
  numResults: z.number().default(20),
  orderBy: z.enum(['newest']).optional().default('newest'),
  contributor: z.string().optional(),
})

export const searchRouter = router({
  resultsForQuery: publicProcedure
    .input(searchQuerySchema)
    .query(async ({ctx, input}) => {
      const {resourceType, moduleTypes, orderBy, contributor} = input
      const results = await sanityClient.fetch(
        `  *[_type in [${
          resourceType
            ? `"${resourceType}"`
            : '"article", "tip", "module", "exercise", "explainer", "talk"'
        }]${
          moduleTypes
            ? ` && moduleType in [${moduleTypes.map(
                (moduleType) => `"${moduleType}"`,
              )}]`
            : ''
        }${
          contributor
            ? ` && contributors[@.role == 'instructor'][0].contributor->slug.current == "${contributor}"`
            : ''
        } && state == 'published']
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
    | order(_score desc${orderBy ? `, ${getOrder(orderBy)}` : ''})
    {
      description,
      _score,
      _id,
      title,
      slug,
      _type,
      "image": image.asset->url,
      "lessonCount": count(resources[@->._type in ['lesson', 'exercise', 'explainer', 'interview']] + resources[@->._type == 'section']->resources[@->._type in ['lesson', 'exercise', 'explainer']]),
      "instructor": contributors[@.role == 'instructor'][0].contributor->{
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

export const searchResultSchema = z.object({
  description: z.string().nullable(),
  _score: z.number(),
  _id: z.string(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  _type: z.string(),
  image: z.string().url().nullable(),
  lessonCount: z.number().nullable(),
  instructor: z
    .object({
      _id: z.string(),
      _type: z.string(),
      _updatedAt: z.string(),
      _createdAt: z.string(),
      name: z.string(),
      bio: z.string().nullable(),
      links: z
        .array(
          z.object({
            url: z.string().url(),
            label: z.string(),
          }),
        )
        .nullable(),
      picture: z
        .object({
          url: z.string().url(),
          alt: z.string().nullable(),
        })
        .nullable(),
      slug: z.string(),
    })
    .nullable(),
  moduleType: z.string(),
  sections: z
    .object({
      _id: z.string(),
      slug: z.string(),
      title: z.string(),
    })
    .nullable(),
  module: z
    .object({
      _id: z.string(),
      slug: z.string(),
      title: z.string(),
      moduleType: z.string().nullable(),
    })
    .nullable(),
})

export type SearchResult = z.infer<typeof searchResultSchema>
