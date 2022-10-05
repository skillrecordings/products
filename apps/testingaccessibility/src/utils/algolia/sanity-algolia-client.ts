import algoliaSearchClientCreator from 'algoliasearch'
import sanityAlgoliaIndexer from 'sanity-algolia'
import isNull from 'lodash/isNull'
import {z} from 'zod'

const algoliaWriteKeySchema = z
  .string()
  .or(z.undefined())
  .transform((val, ctx) => {
    if (process.env.NODE_ENV === 'production' && val === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'ALGOLIA_API_WRITE_KEY must be defined in the production environment.',
      })

      return z.NEVER
    }

    return val || ''
  })

const getAlgoliaApiWriteKeyFromEnvironment = () => {
  return algoliaWriteKeySchema.parse(process.env.ALGOLIA_API_WRITE_KEY)
}

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID
const algoliaApiWriteKey = getAlgoliaApiWriteKeyFromEnvironment()

export const algoliaSearchClient = algoliaSearchClientCreator(
  algoliaAppId,
  algoliaApiWriteKey,
)

const index = algoliaSearchClient.initIndex('lessons')
index.setSettings({
  // attributeForDistinct: 'title',
  attributesForFaceting: ['type'],
  distinct: false,
})

export const sanityAlgolia: any = sanityAlgoliaIndexer(
  {
    lesson: {
      index,
      projection: `{
        title,
        "slug": slug.current,
        body,
        tags[]->{
          _id,
          title,
          "value": value.current
        }
      }`,
    },
    section: {
      index,
      projection: `{
        title,
        "slug": slug.current,
        lessons[]->{
          _id,
          title,
          body,
          "slug": slug.current,
          tags[]->{
            _id,
            title,
            "value": value.current
          }
        }
      }`,
    },
  },
  (document) => {
    switch (document._type) {
      case 'section': {
        return {
          title: document.title,
          path: document.slug,
          lessons: document?.lessons?.map((lesson: any) => {
            return {
              title: lesson.title,
              path: lesson.slug.current,
              type: 'lesson',
              excerpt: isNull(lesson.body) ? '' : toPlainText(lesson.body),
            }
          }),
        }
      }
      case 'lesson': {
        return {
          title: document.title,
          path: document.slug,
          excerpt: isNull(document.body) ? '' : toPlainText(document.body),
          tags: document?.tags?.map((tag: any) => {
            return {
              title: tag.title,
              value: tag.value,
            }
          }),
        }
      }
      default:
        throw new Error(`Unknown type: ${document.type}`)
    }
  },
)

function toPlainText(blocks = []): any {
  if (!blocks) {
    return ''
  }
  return (
    blocks
      // loop through each block
      .map((block: any) => {
        // if it's not a text block with children,
        // return nothing
        if (block._type !== 'block' || !block.children) {
          return ''
        }
        // loop through the children spans, and join the
        // text strings
        return block.children.map((child: any) => child.text).join('')
      })
      // join the paragraphs leaving split by two linebreaks
      .join('\n\n')
  )
}
