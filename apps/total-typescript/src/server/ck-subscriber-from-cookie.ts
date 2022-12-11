import {NextApiRequest} from 'next'
import {SubscriberSchema} from '../schemas/subscriber'
import {fetchSubscriber} from '@skillrecordings/convertkit-sdk'

export async function getSubscriberFromCookie(req: NextApiRequest) {
  const cookies = req.cookies
  if (!cookies) return null
  const cookie = cookies['ck_subscriber']
  if (!cookie || cookie === 'undefined') return null
  try {
    const subscriber = SubscriberSchema.parse(JSON.parse(cookie))
    if (subscriber?.id && !subscriber.email_address) {
      return SubscriberSchema.parse(
        await fetchSubscriber(subscriber.id.toString()),
      )
    }
    return SubscriberSchema.parse(JSON.parse(cookie))
  } catch (e) {
    console.error(e)
    return null
  }
}
