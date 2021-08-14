import { NextApiRequest, NextApiResponse } from 'next'
import { convertkitAxios } from 'utils/axios-convertkit-api'
import fetchConvertkitSubscriberFromServerCookie from 'utils/fetch-convertkit-subscriber'

const answer = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      console.log(req.body)
      const { tagId } = req.body
      const cookieHeader = req.headers.cookie as string
      const [subscriber, ckCookie] = await fetchConvertkitSubscriberFromServerCookie(cookieHeader)

      await convertkitAxios.post(`/tags/${tagId}/subscribe`, {
        api_key: process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN,
        email: subscriber.email_address,
      })

      res.setHeader('Set-Cookie', ckCookie)
      res.setHeader('Cache-Control', 'max-age=10')
      res.status(200).json(subscriber)
    } catch (error) {
      console.log(error)
      res.status(200).end()
    }
  } else {
    console.error('non-post request made')
    res.status(404).end()
  }
}

export default answer
