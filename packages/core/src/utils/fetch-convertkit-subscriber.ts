import fetchEggheadUser from './fetch-egghead-user'
import {convertkitAxios} from './axios-convertkit-api'
import {first, isEmpty} from 'lodash'
import serializeConvertkitCookie from './serialize-convertkit-cookie'
import getTokenFromCookieHeaders from './parse-server-cookie'

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
