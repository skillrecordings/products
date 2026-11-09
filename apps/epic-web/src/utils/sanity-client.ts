import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_ID,
  useCdn: true, // Public reads should not consume the uncached API quota.
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
})
