require('dotenv').config({
  path: `.env.local`,
})

const {program} = require('commander')
const fetch = require('node-fetch')
const assert = require('assert')
const content = require('./content.config')
const fs = require('fs')

program
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option(
    '-p, --production',
    'Sets api url to https://app.egghead.io [Defaults to http://app.egghead.af:5000].',
  )
  .parse(process.argv)

const options = program.opts()

const API_URL = options.production
  ? 'https://app.egghead.io'
  : 'http://app.egghead.af:5000'

assert(
  process.env.BUNDLE_BUDDY_TOKEN !== undefined,
  'You must have the BUNDLE_BUDDY_TOKEN env variable set!',
)

const headers = {
  Authorization: `Bearer ${process.env.BUNDLE_BUDDY_TOKEN}`,
  'Content-Type': 'application/json',
}

const ENV = options.production ? 'production' : 'development'

function fetchContentCollectionByType(content, type) {
  return (
    content
      .filter((resource) => resource.type === type && resource.slug !== null)
      // .filter((resource) => resource.type === type)
      .map(async (collection) => {
        const {type, ...typelessCollection} = collection
        console.log(
          `fetching: ${API_URL}/api/v1/playlists/${collection.resource_id}`,
        )
        const response = await fetch(
          `${API_URL}/api/v1/playlists/${collection.resource_id}`,
          {
            headers,
          },
        ).then((response) => {
          if (response.status === 403) {
            throw 'Request failed, is your BUNDLE_BUDDY_TOKEN valid?'
          }
          return response
        })
        const collectionData = await response.json()
        return {
          ...collectionData,
          ...typelessCollection,
        }
      })
  )
}

function prettyPrintJSON(data) {
  return JSON.stringify(data, null, 2)
}

function storeData(data, path) {
  try {
    fs.writeFileSync(path, prettyPrintJSON(data))
  } catch (err) {
    console.error(err)
  }
}

async function writeDataToJSON() {
  const bundles = await Promise.all(
    fetchContentCollectionByType(content, 'bundle'),
  )
  const collections = await Promise.all(
    fetchContentCollectionByType(content, 'collection'),
  )

  const path = './data/'
  const bundlesPath = path + `bundles.${ENV}.json`
  const collectionsPath = path + `collections.${ENV}.json`

  console.log(`storing: ${bundlesPath}`)
  console.log(`storing: ${collectionsPath}`)

  storeData(bundles, bundlesPath)
  storeData(collections, collectionsPath)
}

writeDataToJSON()
