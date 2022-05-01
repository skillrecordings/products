import client from '@sanity/client'
import type {SanityClient} from '@sanity/client'

export const sanityClient: SanityClient = client({
  projectId: 'erxflg2z',
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2021-10-19',
})
