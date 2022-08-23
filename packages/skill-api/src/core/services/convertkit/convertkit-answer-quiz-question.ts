import {SkillRecordingsHandlerParams} from '../../types'
import {OutgoingResponse} from '../../index'
import toLower from 'lodash/toLower'
import {
  fetchSubscriber,
  getConvertkitSubscriberCookie,
  setConvertkitSubscriberFields,
  subscribeToTag,
} from '@skillrecordings/convertkit-sdk'

export async function convertkitAnswerQuizQuestion({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const {tagId, survey} = params.req.body
    const convertkitId =
      params.req.cookies?.[
        process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY || 'ck_subscriber_id'
      ]

    if (!convertkitId) {
      return {
        status: 200,
      }
    }

    const subscriber = await fetchSubscriber(convertkitId)
    const questionId = toLower(survey.id)

    if (tagId) {
      await subscribeToTag(subscriber.email_address, tagId)
    }

    await setConvertkitSubscriberFields(subscriber, {
      [questionId]: survey.answer,
    })

    return {
      status: 200,
      body: subscriber,
      cookies: getConvertkitSubscriberCookie(subscriber),
    }
  } catch (error) {
    return {
      status: 200,
    }
  }
}
