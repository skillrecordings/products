import {NextApiRequest, NextApiResponse} from 'next'
import {convertkitAxios} from '@skillrecordings/axios'
import serverCookie from 'cookie'

const CK_SUBSCRIBER_KEY = process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY
const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const {email_address, first_name, fields, tag} = req.body
      const url = tag
        ? `/tags/${tag}/subscribe`
        : `/forms/${process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM}/subscribe`
      const subscriber = await convertkitAxios
        .post(url, {
          email: email_address,
          first_name,
          fields,
          api_key: process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN,
        })
        .then(({data}) => {
          return data.subscription.subscriber
        })

      const convertkitCookie = serverCookie.serialize(
        CK_SUBSCRIBER_KEY as string,
        subscriber.id,
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 31556952,
        },
      )

      res.setHeader('Set-Cookie', convertkitCookie)

      res.status(200).json(subscriber)
    } catch (error) {
      console.log(error)
      res.status(200).end(error.message)
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default subscribe
