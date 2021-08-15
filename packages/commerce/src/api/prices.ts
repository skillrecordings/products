import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders} from '@skillrecordings/auth'
import axios from 'axios'

const pricesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const {eggheadToken} = getTokenFromCookieHeaders(
        req.headers.cookie as string,
      )
      const pricesUrl = '/api/v1/sellable_purchases/prices'
      const eggheadPriceCheckUrl = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}${pricesUrl}`

      const headers = {
        ...(!!eggheadToken && {
          Authorization: `Bearer ${eggheadToken}`,
        }),
        ...(!!process.env.NEXT_PUBLIC_CLIENT_ID && {
          'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID,
        }),
      }

      console.log(req.body, headers, process.env.NEXT_PUBLIC_CLIENT_ID)
      await axios
        .post(eggheadPriceCheckUrl, req.body, {
          headers,
        })
        .then(({data}) => {
          res.status(200).json(data)
        })
        .catch((error) => {
          console.error(error)
          res.status(500).end(error.message)
        })
    } catch (error) {
      console.log(error)
      res.status(500).end(error.message)
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default pricesHandler
