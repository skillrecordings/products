import client from '@sanity/client'
import type {SanityClient} from '@sanity/client'

export const sanityClient: SanityClient = client({
  projectId: '31ybkxse',
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2022-07-03',
})
