import client from '@sanity/client'

export const sanityClient = client({
  projectId: '5f31d77n',
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2021-10-26',
})
