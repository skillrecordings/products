import sanityClient from '@sanity/client'

export const sanityWriteClient = sanityClient({
  projectId: 'z9io1e0u',
  dataset: 'production',
  useCdn: process.env.NODE_ENV !== 'development', // `false` if you want to ensure fresh data
  apiVersion: '2021-10-19',
  token: process.env.SANITY_API_TOKEN,
})
