import {NextApiRequest, NextApiResponse} from 'next'
import {convertkitAxios} from '@skillrecordings/axios'
import {fetchConvertkitSubscriberFromServerCookie} from '@skillrecordings/convertkit'

if (!process.env.CONVERTKIT_BASE_URL)
  throw new Error('No Convertkit API Base Url Found: CONVERTKIT_BASE_URL')

if (!process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN)
  throw new Error('No Convertkit Token Found: NEXT_PUBLIC_CONVERTKIT_TOKEN')

const answer = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      console.log(req.body)
      const {tagId} = req.body
      const cookieHeader = req.headers.cookie as string
      const [subscriber, ckCookie] =
        await fetchConvertkitSubscriberFromServerCookie(cookieHeader)

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
