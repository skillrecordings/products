import {createClient, type SanityClient} from '@sanity/client'

export const sanityClient: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_ID,
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
})
