import client from '@sanity/client'

export const sanityClient = client({
  projectId: 'if3ypl2p',
  dataset: 'production',
  apiVersion: '2021-04-30', // use a UTC date string
  useCdn: true, // `false` if you want to ensure fresh data
})
