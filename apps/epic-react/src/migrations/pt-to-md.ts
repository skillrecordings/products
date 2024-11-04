// HOW TO USE:
// 1. Change the field type from 'body' to 'markdown' (e.g. in schemas/documents/article.ts)
// 2. Run `sanity exec --with-user-token migrations/pt-to-md.ts`

// @ts-ignore
import BlocksToMarkdown from '@sanity/block-content-to-markdown'
import {getCliClient} from 'sanity/cli'
import {Transaction} from '@sanity/client'
import chunk from 'lodash/chunk'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type Metadata = {
  _id: string
  _rev: string
}

type Doc = Prettify<
  | ({
      body: any[]
    } & Metadata)
  | ({summary: any[]} & Metadata)
>

type DocPatch = {
  id: string
  patch:
    | {
        set: {body: string}
        ifRevisionID: string
      }
    | {
        set: {summary: string}
        ifRevisionID: string
      }
}

// Gets the client configuration from `sanity.cli.ts` and returns a client.
// Will include write token when run with `sanity exec --with-user-token`
const client = getCliClient()

// Fetch the documents we want to migrate, and return only the fields we need.
const fetchDocuments = async () => {
  const pairs = [
    ['section', 'body'],
    ['module', 'body'],
    ['tip', 'body'],
    ['tip', 'summary'],
    ['explainer', 'body'],
    ['testimonial', 'body'],
    ['exercise', 'body'],
  ]

  const collectionOfDocuments: {[key: string]: any[]} = {}

  for (const pair of pairs) {
    const [documentType, fieldName] = pair

    const key = `${documentType}:${fieldName}`

    collectionOfDocuments[key] = await client.fetch(
      `*[_type == '${documentType}' && defined(${fieldName})] {_id, _rev, ${fieldName}}`,
    )
  }

  return collectionOfDocuments
}

// Build a patch for each document, represented as a tuple of `[documentId, patch]`
const buildPatches = (docs: Doc[]) => {
  return docs.map((doc: Doc): DocPatch => {
    if ('body' in doc) {
      const bodyMarkdown = BlocksToMarkdown(doc.body, {serializers})
      return {
        id: doc._id,
        patch: {
          set: {body: bodyMarkdown},
          // this will cause the migration to fail if any of the documents has been
          // modified since it was fetched.
          ifRevisionID: doc._rev,
        },
      }
    } else if ('summary' in doc) {
      const bodyMarkdown = BlocksToMarkdown(doc.summary, {serializers})
      return {
        id: doc._id,
        patch: {
          set: {summary: bodyMarkdown},
          // this will cause the migration to fail if any of the documents has been
          // modified since it was fetched.
          ifRevisionID: doc._rev,
        },
      }
    } else {
      const exhaustiveCheck: never = doc
      throw new Error(`Unhandled doc case: ${exhaustiveCheck}`)
    }
  })
}

const createTransaction = (patches: DocPatch[]): Transaction =>
  patches.reduce(
    (tx: any, patch: DocPatch) => tx.patch(patch.id, patch.patch),
    client.transaction(),
  )

const commitTransaction = (tx: Transaction) => tx.commit()

const migrateByDocumentInBatches = async (): Promise<void> => {
  const documents = await fetchDocuments()
  for (const [docKey, collection] of Object.entries(documents)) {
    // const [documentType, fieldName] = docKey.split(':')

    for (const subCollection of chunk(collection, 100)) {
      const patches = buildPatches(subCollection)

      console.log(
        `Migrating batch:\n %s`,
        patches
          .map((patch) => `${patch.id} => ${JSON.stringify(patch)}`)
          .join('\n'),
      )
      const transaction = createTransaction(patches)
      await commitTransaction(transaction)
    }
  }
}

migrateByDocumentInBatches().catch((err: any) => {
  console.error(err)
  process.exit(1)
})

const {getImageUrl} = BlocksToMarkdown

const serializers = {
  types: {
    image: ({node}: any) =>
      `![${node.alt || ''}](${getImageUrl({options: {}, node})})`,
    // From @sanity/code-input
    code: ({node}: any) => `\`\`\`${node.language || ''}\n${node.code}\n\`\`\``,
    bodyTweet: ({node}: any) => `Tweet from ${node.tweet.handle}`,
    bodyImage: ({node}: any) =>
      `![${node.image.alt ? node.image.alt : ''}](${node.image.url})`,
    bodyVideo: ({node}: any) => {
      const {url, title} = node
      return url
        ? title
          ? `<Video url="${url}" title="${title}" />`
          : `<Video url="${url}" />`
        : ''
    },
    callout: ({node}: any) => {
      const {body} = node
      return `${BlocksToMarkdown(body)}`
    },
    divider: () => `---`,
  },
  marks: {
    internalLink: ({mark, children}: any) => {
      const {slug = {}} = mark
      const href = `/${slug.current}`
      return `[${children}](${href})`
    },
    link: ({mark, children}: any) => {
      // Read https://css-tricks.com/use-target_blank/
      const {blank, href} = mark
      return blank
        ? `<a href="${href}" target="_blank" rel="noopener">${children}</a>`
        : `[${children}](${href})`
    },
    externalLink: ({mark, children}: any) => {
      const {blank, href} = mark
      return blank
        ? `<a href="${href}" target="_blank" rel="noopener">${children}</a>`
        : `[${children}](${href})`
    },
    emoji: ({mark, children}: any) => {
      return `${children}`
    },
    undefined: () => {
      return ''
    },
  },
}
