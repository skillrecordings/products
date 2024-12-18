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
      JSON.stringify(deepOmitNull(subscriber)),
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

function deepOmitNull(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepOmitNull).filter((x) => x !== null)
  }

  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleaned = deepOmitNull(value)
      if (cleaned !== null) {
        acc[key] = cleaned
      }
      return acc
    }, {} as Record<string, any>)
  }

  return obj === null ? undefined : obj
}
