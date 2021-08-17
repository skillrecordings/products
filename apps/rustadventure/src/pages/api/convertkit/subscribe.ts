import {NextApiRequest, NextApiResponse} from 'next'
import {convertkitAxios} from '@skillrecordings/axios'

import serverCookie from 'cookie'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'

const TRIGGER_RUST_ADVENTURE_TAG_ID = 2475256

const subscriber = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const url = `/tags/${TRIGGER_RUST_ADVENTURE_TAG_ID}/subscribe`
      const {email, first_name, fields} = req.body
      const subscription = await convertkitAxios
        .post(url, {
          email,
          first_name,
          fields,
          api_key: process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN,
        })
        .then(({data}) => {
          return data.subscription
        })

      const convertkitCookie = serverCookie.serialize(
        CK_SUBSCRIBER_KEY,
        subscription.id,
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 31556952,
        },
      )

      res.setHeader('Set-Cookie', convertkitCookie)

      res.status(200).json(subscription)
    } catch (error) {
      console.log(error)
      res.status(200).end(error.message)
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default subscriber
