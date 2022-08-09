import client from '@sanity/client'

export const sanityClient = client({
  projectId: 'z9slyadj',
  dataset: 'production',
  useCdn: process.env.NODE_ENV === 'development' ? false : true, // `false` if you want to ensure fresh data
  apiVersion: '2021-10-19',
})
