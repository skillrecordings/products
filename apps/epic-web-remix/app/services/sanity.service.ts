import client from '@sanity/client'
import type {SanityClient} from '@sanity/client'

export const sanityClient: SanityClient = client({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET_ID,
  useCdn: process.env.NODE_ENV === 'production' ? true : false, // `false` if you want to ensure fresh data
  apiVersion: process.env.SANITY_API_VERSION,
})
