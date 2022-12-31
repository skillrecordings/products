import {Subscriber} from '@skillrecordings/skill-lesson/schemas/subscriber'
import {Identify} from '@amplitude/identify'
import Amplitude from '@amplitude/node'
import {isEmpty} from 'lodash'
const amplitude = Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY)

export async function identifyServer(subscriber: Subscriber) {
  if (!subscriber?.email_address) return
  try {
    const identify = new Identify()

    for (const field in subscriber.fields) {
      if (!isEmpty(subscriber.fields[field])) {
        identify.set(field, subscriber.fields[field] as any)
      } else {
        identify.unset(field)
      }
    }

    return amplitude.identify(subscriber.email_address, null, identify)
  } catch (e) {
    return Promise.resolve(e)
  }
}
