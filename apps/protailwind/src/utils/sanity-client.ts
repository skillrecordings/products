import client from '@sanity/client'
import type {SanityClient} from '@sanity/client'

export const sanityClient: SanityClient = client({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2021-10-19',
})
