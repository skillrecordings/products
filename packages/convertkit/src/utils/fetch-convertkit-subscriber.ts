import fetchEggheadUser from './fetch-egghead-user'
import {convertkitAxios} from '@skillrecordings/axios'
import {first, isEmpty} from 'lodash'
import serializeConvertkitCookie from './serialize-convertkit-cookie'
import * as serverCookie from 'cookie'
import {ACCESS_TOKEN_KEY, CK_SUBSCRIBER_KEY} from '@skillrecordings/config'

interface ParsedCookie {
  [key: string]: string
}

const getConvertkitId = (parsedCookie: ParsedCookie) => {
  const result = CK_SUBSCRIBER_KEY ? parsedCookie[CK_SUBSCRIBER_KEY] : ''
  return result || ''
}

function getTokenFromCookieHeaders(serverCookies: string = '') {
  const parsedCookie = serverCookie.parse(serverCookies)
  const eggheadToken = parsedCookie[ACCESS_TOKEN_KEY] || ''
  const convertkitId = getConvertkitId(parsedCookie)
  return {convertkitId, eggheadToken, loginRequired: eggheadToken.length <= 0}
}

export default async function fetchConvertkitSubscriberFromServerCookie(
  header: string,
) {
  if (!process.env.CONVERTKIT_API_SECRET)
    throw new Error('No Convertkit Secret Key Found')

  const {convertkitId, eggheadToken} = getTokenFromCookieHeaders(header)

  let subscriber

  if (!convertkitId) {
    const eggheadUser = await fetchEggheadUser(eggheadToken)
    if (isEmpty(eggheadUser))
      throw new Error('unable to load convertkit subscriber')
    subscriber = await convertkitAxios
      .get(
        `/subscribers?api_secret=${process.env.CONVERTKIT_API_SECRET}&email_address=${eggheadUser.email}`,
      )
      .then(({data}) => first(data.subscribers))
  } else {
    subscriber = await convertkitAxios
      .get(
        `/subscribers/${convertkitId}?api_secret=${process.env.CONVERTKIT_API_SECRET}`,
      )
      .then(({data}) => data.subscriber)
  }

  if (isEmpty(subscriber))
    throw new Error('no convertkit subscriber was loaded')

  const ckCookie = serializeConvertkitCookie(subscriber.id)

  return [subscriber, ckCookie]
}
