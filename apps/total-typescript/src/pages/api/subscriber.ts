import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {prisma, User} from '@skillrecordings/database'
import {getSubscriberByEmail} from 'lib/get-subscriber-by-email'
import {fetchSubscriber} from '@skillrecordings/convertkit-sdk'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import {serialize} from 'cookie'

const convertkitSubscriberHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'GET') {
    let subscriber

    if (req.query.ckSubscriberId) {
      subscriber = await fetchSubscriber(req.query.ckSubscriberId as string)
    } else if (req.query.learner) {
      const user = await prisma.user.findUnique({
        where: {id: req.query.learner as string},
      })
      subscriber = user?.email && (await getSubscriberByEmail(user?.email))
    } else if (req.cookies['ck_subscriber']) {
      subscriber = JSON.parse(req.cookies['ck_subscriber'])
    }

    if (subscriber) {
      const convertkitCookie = serialize(
        `ck_subscriber`,
        JSON.stringify(subscriber),
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 31556952,
        },
      )

      res.setHeader('Set-Cookie', convertkitCookie)
      res.status(200).json(subscriber)
    } else {
      res.status(200).end()
    }
  } else {
    res.status(200).end()
  }
}

export default withSentry(convertkitSubscriberHandler)
export const config = {
  api: {
    externalResolver: true,
  },
}
