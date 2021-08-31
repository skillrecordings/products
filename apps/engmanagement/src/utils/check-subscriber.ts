import {GetServerSidePropsContext} from 'next'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import {CK_SUBSCRIBER_KEY, ACCESS_TOKEN_KEY} from '@skillrecordings/config'
import {fetchConvertkitSubscriberFromServerCookie} from '@skillrecordings/convertkit'

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

  // test
  // const subscriber = {
  //   tags: [
  //     {
  //       id: '123456',
  //     },
  //   ],
  // }

  // if tagId is passed then check if subscriber is tagged
  // if not, simply check if they're subscribed
  const subscribed: boolean = tagId
    ? (subscriber && !isEmpty(find(subscriber.tags, {id: tagId}))) || false
    : !isEmpty(subscriber)

  return subscribed
}
