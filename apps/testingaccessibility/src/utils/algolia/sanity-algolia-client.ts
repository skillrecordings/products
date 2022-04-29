import algoliasearch from 'algoliasearch'
import indexer, {flattenBlocks} from 'sanity-algolia'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_WRITE_KEY as string

export const algolia = algoliasearch(appId, apiKey)

const index = algolia.initIndex('lessons')
index.setSettings({
  // attributeForDistinct: 'title',
  attributesForFaceting: ['type'],
  distinct: false,
})

export const sanityAlgolia: any = indexer(
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
              excerpt: toPlainText(lesson.body),
            }
          }),
        }
      }
      case 'lesson': {
        return {
          title: document.title,
          path: document.slug,
          excerpt: toPlainText(document.body),
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
