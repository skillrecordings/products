import {SkillRecordingsHandlerParams} from '../../types'
import {OutgoingResponse} from '../../index'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import {
  createConvertkitTag,
  fetchSubscriber,
  setConvertkitSubscriberFields,
  subscribeToTag,
} from '../../lib/convertkit'

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

    if (!convertkitId)
      return {
        status: 200,
      }
    const subscriber = await fetchSubscriber(convertkitId)
    const questionId = survey.id

    // Subscribe user to tag
    if (tagId) {
      await subscribeToTag(subscriber.email_address, tagId)
    }

    // Create question field if it doesn't exist
    const fieldExists = !isEmpty(
      find(Object.keys(subscriber.fields), (field) => field === questionId),
    )
    if (!fieldExists) {
      await createConvertkitTag(questionId)
    }

    // Submit user answer
    await setConvertkitSubscriberFields(subscriber.id, {
      [questionId]: survey.answer,
    })

    const hour = 3600000
    const oneYear = 365 * 24 * hour

    return {
      status: 200,
      body: subscriber,
      cookies: [
        {
          name:
            process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY ||
            'ck_subscriber_id',
          value: subscriber.id,
          options: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
            maxAge: oneYear,
          },
        },
        {
          name: 'ck_subscriber',
          value: JSON.stringify(subscriber),
          options: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
            maxAge: oneYear,
          },
        },
      ],
      headers: [],
    }
  } catch (error) {
    return {
      status: 200,
    }
  }
}
