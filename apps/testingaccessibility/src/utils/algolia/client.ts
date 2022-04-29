import algoliasearch from 'algoliasearch/lite'
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_PUBLIC_KEY as string

export const searchClient = algoliasearch(appId, apiKey)
