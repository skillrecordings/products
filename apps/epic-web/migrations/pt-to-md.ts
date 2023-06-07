// HOW TO USE:
// 1. Change the field type from 'body' to 'markdown' (e.g. in schemas/documents/article.ts)
// 2. Run `sanity exec --with-user-token migrations/pt-to-md.ts`

// @ts-ignore
import BlocksToMarkdown from '@sanity/block-content-to-markdown'
import {getCliClient} from 'sanity/cli'
import {Transaction} from '@sanity/client'

type Doc = {
  _id: string
  _rev: string
  body: any[]
}

type DocPatch = {
  id: string
  patch: {
    set: {body: string}
    unset: string[]
    ifRevisionID: string
  }
}

// Gets the client configuration from `sanity.cli.ts` and returns a client.
// Will include write token when run with `sanity exec --with-user-token`
const client = getCliClient()

// Fetch the documents we want to migrate, and return only the fields we need.
const fetchDocuments = () =>
  client.fetch(`*[_type == 'tip' && defined(body)][0...100] {_id, _rev, body}`)

// Build a patch for each document, represented as a tuple of `[documentId, patch]`
const buildPatches = (docs: Doc[]) =>
  docs.map((doc: Doc): any => {
    const bodyMarkdown = BlocksToMarkdown(doc.body, {serializers})
    console.log({bodyMarkdown})
    return {
      id: doc._id,
      patch: {
        set: {body: bodyMarkdown},
        // this will cause the migration to fail if any of the documents has been
        // modified since it was fetched.
        ifRevisionID: doc._rev,
      },
    }
  })

const createTransaction = (patches: DocPatch[]): Transaction =>
  patches.reduce(
    (tx: any, patch: DocPatch) => tx.patch(patch.id, patch.patch),
    client.transaction(),
  )

const commitTransaction = (tx: Transaction) => tx.commit()

const migrateNextBatch = async (): Promise<void> => {
  const documents = await fetchDocuments()
  const patches = buildPatches(documents)
  if (patches.length === 0) {
    console.log('No more documents to migrate!')
    process.exit(1)
  }
  console.log(
    `Migrating batch:\n %s`,
    patches
      .map((patch) => `${patch.id} => ${JSON.stringify(patch)}`)
      .join('\n'),
  )
  const transaction = createTransaction(patches)
  await commitTransaction(transaction)
  return migrateNextBatch()
}

migrateNextBatch().catch((err: any) => {
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
