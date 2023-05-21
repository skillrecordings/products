import {type NextApiResponse} from 'next'
import {serialize} from 'cookie'
import {type Subscriber} from '../schemas/subscriber'

export function convertkitSetSubscriberCookie({
  subscriber,
  res,
}: {
  subscriber?: Subscriber | null
  res: NextApiResponse
}) {
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
  }
}
