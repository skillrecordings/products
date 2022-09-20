import client from '@sanity/client'
import type {SanityClient} from '@sanity/client'

export const sanityClient: SanityClient = client({
  projectId: 's8qytc9h',
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2022-07-29',
})
