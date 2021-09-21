import pricesHandler from '@skillrecordings/commerce/dist/api/prices'
import {getTokenFromCookieHeaders} from '@skillrecordings/auth'
import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const {eggheadToken} = getTokenFromCookieHeaders(
        req.headers.cookie as string,
      )
      const pricesUrl = '/api/v1/next/pricing'
      const eggheadPriceCheckUrl = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}${pricesUrl}`

      console.log(eggheadPriceCheckUrl)

      const headers = {
        ...(!!eggheadToken && {
          Authorization: `Bearer ${eggheadToken}`,
        }),
        ...(!!process.env.NEXT_PUBLIC_CLIENT_ID && {
          'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID,
        }),
      }

      await axios
        .get(eggheadPriceCheckUrl, {
          headers,
        })
        .then(({data}) => {
          res.status(200).json(data)
        })
        .catch((error) => {
          // console.error(error)
          res.status(500).end(error.message)
        })
    } catch (error) {
      // console.log(error)
      res.status(500).end(error.message)
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}
