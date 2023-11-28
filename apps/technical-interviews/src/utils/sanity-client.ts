import {createClient} from '@sanity/client'
import type {SanityClient} from '@sanity/client'

export const sanityClient: SanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: process.env.SANITY_API_VERSION,
})
