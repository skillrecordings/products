import {GetServerSidePropsContext} from 'next'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import {CK_SUBSCRIBER_KEY, ACCESS_TOKEN_KEY} from '@skillrecordings/config'
import {fetchConvertkitSubscriberFromServerCookie} from '@skillrecordings/convertkit-react-ui'

export default async function checkSubscriber(
  context: GetServerSidePropsContext,
  tagId?: number,
) {
  const cookieHeader = context.req.headers.cookie as string
  const eggheadToken = get(context.req.cookies, ACCESS_TOKEN_KEY)
  const convertkitId = get(context.req.cookies, CK_SUBSCRIBER_KEY)

  const [subscriber] =
    convertkitId || eggheadToken
      ? await fetchConvertkitSubscriberFromServerCookie(cookieHeader)
      : [null]

  const subscribed: boolean = !isEmpty(subscriber)

  return subscribed
}
