// sessionize requests should be cached

import type {NextApiRequest, NextApiResponse} from 'next'

let cachedData: number
let cacheTime: number

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // If we have cached data and it's less than 5 minutes old, return it
  if (cachedData && Date.now() - cacheTime < 5 * 60 * 1000) {
    return res.json(cachedData)
  }

  // Fetch new data
  const data = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/Speakers',
  ).then((res) => res.json())

  // Update cache
  cachedData = data
  cacheTime = Date.now()

  res.json(data)
}
