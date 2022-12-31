import {convertkitAxios} from '@skillrecordings/axios'
import {first, isEmpty} from 'lodash'
import serializeConvertkitCookie from './serialize-convertkit-cookie'
import * as serverCookie from 'cookie'
import {
  ACCESS_TOKEN_KEY,
  CK_SUBSCRIBER_KEY,
  CONVERTKIT_TOKEN,
  CONVERTKIT_API_SECRET,
} from '@skillrecordings/config'

interface ParsedCookie {
  [key: string]: string
}

const getConvertkitId = (parsedCookie: ParsedCookie) => {
  const result = CK_SUBSCRIBER_KEY ? parsedCookie[CK_SUBSCRIBER_KEY] : ''
  return result || ''
}

function getTokenFromCookieHeaders(serverCookies: string = '') {
  const parsedCookie = serverCookie.parse(serverCookies)
  return getConvertkitId(parsedCookie)
}

/**
 * @deprecated ☠️ use the convertkit-sdk package instead!
 * @param header
 */
export default async function fetchConvertkitSubscriberFromServerCookie(
  header: string,
) {
  if (!CONVERTKIT_API_SECRET) throw new Error('No Convertkit Secret Key Found')

  const convertkitId = getTokenFromCookieHeaders(header)

  let subscriber

  if (convertkitId) {
    subscriber = await convertkitAxios
      .get(`/subscribers/${convertkitId}?api_secret=${CONVERTKIT_API_SECRET}`)
      .then(({data}) => data.subscriber)
  }

  if (isEmpty(subscriber))
    throw new Error('no convertkit subscriber was loaded')

  const tags = await convertkitAxios
    .get(`/subscribers/${subscriber.id}/tags?api_key=${CONVERTKIT_TOKEN}`)
    .then(({data}) => data.tags)

  subscriber = {...subscriber, tags}

  const ckCookie = serializeConvertkitCookie(subscriber.id)

  return [subscriber, ckCookie]
}
