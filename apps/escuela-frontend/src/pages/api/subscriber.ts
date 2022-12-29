import {NextApiRequest, NextApiResponse} from 'next'
import {fetchConvertkitSubscriberFromServerCookie} from '@skillrecordings/convertkit-react-ui'
import {withSentry} from '@sentry/nextjs'

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

export default withSentry(subscriber)

export const config = {
  api: {
    externalResolver: true,
  },
}
