import {type NextApiRequest} from 'next'
import {SubscriberSchema} from '../schemas/subscriber'
import {fetchSubscriber} from '@skillrecordings/convertkit-sdk'

export async function getSubscriberFromCookie(req: NextApiRequest) {
  const cookies = req.cookies
  if (!cookies) return null
  const cookie = cookies['ck_subscriber']
  if (!cookie || cookie === 'undefined') return null
  try {
    const subscriber = JSON.parse(cookie)
    if (subscriber?.id && !subscriber.email_address) {
      return SubscriberSchema.parse(
        await fetchSubscriber(subscriber.id.toString()),
      )
    }
    if (!subscriber?.id) throw new Error('no subscriber id')
    return SubscriberSchema.parse(subscriber)
  } catch (e) {
    return null
  }
}
