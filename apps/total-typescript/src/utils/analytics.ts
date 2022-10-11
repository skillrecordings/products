import {track as defaultTrack} from '@skillrecordings/analytics'
import {
  identify as amplitudeIdentify,
  Identify,
  setUserId,
  track as amplitudeTrack,
} from '@amplitude/analytics-browser'
import {Subscriber} from 'schemas/subscriber'
import {isEmpty} from 'lodash'

export async function track(event: string, params?: any) {
  console.debug(`track ${event}`, params)
  amplitudeTrack(event, params)
  return defaultTrack(event, params)
}

export async function identify(subscriber: Subscriber): Promise<unknown> {
  if (!subscriber) return
  try {
    const identify = new Identify()

    setUserId(subscriber.email_address)

    for (const field in subscriber.fields) {
      if (!isEmpty(subscriber.fields[field])) {
        identify.set(field, subscriber.fields[field] as any)
      } else {
        identify.unset(field)
      }
    }

    return amplitudeIdentify(identify).promise
  } catch (e) {
    return Promise.resolve(e)
  }
}
