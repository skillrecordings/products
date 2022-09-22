import client from '@sanity/client'

export const sanityClient = client({
  projectId: 'z9io1e0u',
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2021-10-19',
})
