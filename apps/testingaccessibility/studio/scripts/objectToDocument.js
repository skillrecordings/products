import sanityClient from 'part:@sanity/base/client'
import {uuid} from 'short-uuid'

const client = sanityClient.withConfig({
  apiVersion: '2021-08-21',
  token: process.env.SANITY_WRITE_TOKEN,
  dataset: 'test',
})

const fetchDocuments = () => {
  return client.fetch(`*[_type == "lesson"]{_id, title, body}`)
}

const buildPatches = (docs) => {
  return docs.map((doc) => {
    const {videoResourceMutations, bodyVideoMutations} = getBodyVideos(doc)

    return {
      id: doc._id,
      patch: {
        set: {
          body: bodyVideoMutations,
        },
      },
      create: videoResourceMutations,
    }
  })
}

const transactionReducer = (transaction, patches, func) => {
  return patches.reduce((tx, patch) => {
    return func(tx, patch)
  }, transaction) // start a new transaction for the batch
}

const createBodyVideoTransaction = (tx, patch) => {
  return tx.patch(patch.id, patch.patch) // patch the document
}

const createVideoResourceTransaction = (tx, patch) => {
  return patch.create.reduce((acc, create) => {
    return acc.create(create) // create a document
  }, tx)
}

const commitTransaction = (tx) => tx.commit()

const getBodyVideos = (doc) => {
  let body = doc.body
  let videoResourceMutations = []

  const bodyVideoMutations = body.map((item) => {
    if (item._type === 'bodyVideo') {
      const patch = buildVideoResourcePatches(item)
      videoResourceMutations.push(patch)

      return {
        _key: item._key,
        _type: 'bodyVideo',
        videoResource: {
          _type: 'reference',
          _ref: patch._id,
        },
      }
    } else {
      return item
    }
  })

  return {
    videoResourceMutations,
    bodyVideoMutations,
  }
}

const buildVideoResourcePatches = (bodyVideo) => {
  return {
    _id: uuid(),
    _type: 'videoResource',
    title: bodyVideo.title,
    mediaUrl: bodyVideo.url,
    transcript: bodyVideo.caption,
  }
}

const migrateBatch = async () => {
  const documents = await fetchDocuments()
  const patches = buildPatches(documents)

  console.log(
    `Migrating batch:\n $s`,
    patches
      .map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`)
      .join('\n'),
  )

  let transaction = transactionReducer(
    client.transaction(),
    patches,
    createBodyVideoTransaction,
  )
  transaction = transactionReducer(
    transaction,
    patches,
    createVideoResourceTransaction,
  )

  await commitTransaction(transaction)
}

const iterateInBatches = (documents) => {
  const batches = []

  for (let i = 0; i < documents.length; i += 50) {
    batches.push(documents.slice(i, i + 50))
  }

  return batches
}

const runMigration = async () => {
  const documents = await fetchDocuments()
  const batches = iterateInBatches(documents)

  batches.forEach((batch) => {
    migrateBatch(batch).catch((err) => {
      console.error(err)
      process.exit(1)
    })
  })
}

runMigration()
