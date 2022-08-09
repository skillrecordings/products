import {SkillRecordingsHandlerParams} from '../../types'
import {OutgoingResponse} from '../../index'
import {
  fetchSubscriber,
  getConvertkitSubscriberCookie,
  oneYear,
} from '../../lib/convertkit'

export async function convertkitLoadSubscriber({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const convertkitId =
      params.req.query[
        process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY || 'ck_subscriber_id'
      ] ||
      params.req.cookies?.[
        process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY || 'ck_subscriber_id'
      ]

    if (!convertkitId)
      return {
        status: 200,
      }

    const subscriber = await fetchSubscriber(convertkitId)

    if (subscriber) {
      return {
        status: 200,
        body: subscriber,
        cookies: getConvertkitSubscriberCookie(subscriber),
        headers: [{key: 'Cache-Control', value: 'max-age=10'}],
      }
    } else {
      return {
        status: 200,
      }
    }
  } catch (error) {
    return {
      status: 200,
    }
  }
}
