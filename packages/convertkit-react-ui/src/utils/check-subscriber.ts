import {GetServerSidePropsContext} from 'next'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {CK_SUBSCRIBER_KEY, ACCESS_TOKEN_KEY} from '@skillrecordings/config'
import fetchConvertkitSubscriberFromServerCookie from './fetch-convertkit-subscriber'

/**
 * @deprecated use skill-lessons packages instead
 * @param context
 * @param tagId
 */
export async function checkIfConvertkitSubscriber(
  context: GetServerSidePropsContext,
  tagId?: number,
) {
  try {
    const cookieHeader = context.req.headers.cookie as string
    const eggheadToken = get(context.req.cookies, ACCESS_TOKEN_KEY)
    const convertkitId = get(context.req.cookies, CK_SUBSCRIBER_KEY)

    const [subscriber] =
      convertkitId || eggheadToken
        ? await fetchConvertkitSubscriberFromServerCookie(cookieHeader)
        : [null]

    const subscribed: boolean = !isEmpty(subscriber)

    return subscribed
  } catch (error) {
    console.error(error)
    return false
  }
}
