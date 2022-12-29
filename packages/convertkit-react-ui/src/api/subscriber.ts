import {NextApiRequest, NextApiResponse} from 'next'
import fetchConvertkitSubscriberFromServerCookie from '../utils/fetch-convertkit-subscriber'

/**
 * @deprecated use skill-api instead
 * @param req
 * @param res
 */
const subscriber = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const cookieHeader = req.headers.cookie as string
      const [subscriber, ckCookie] =
        await fetchConvertkitSubscriberFromServerCookie(cookieHeader)
      res.setHeader('Set-Cookie', ckCookie)
      res.setHeader('Cache-Control', 'max-age=10')
      res.status(200).json(subscriber)
    } catch (error) {
      res.status(200).end()
    }
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

/**
 * @deprecated use skill-api instead
 */
export default subscriber
