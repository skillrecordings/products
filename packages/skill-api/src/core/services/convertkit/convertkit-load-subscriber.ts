import {SkillRecordingsHandlerParams} from '../../types'
import {OutgoingResponse} from '../../index'
import {fetchSubscriber} from '../../lib/convertkit'

export async function convertkitLoadSubscriber({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const convertkitId =
      params.req.cookies?.[
        process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY || 'ck_subscriber_id'
      ]

    if (!convertkitId)
      return {
        status: 200,
      }

    const subscriber = await fetchSubscriber(convertkitId)

    const hour = 3600000
    const oneYear = 365 * 24 * hour

    if (subscriber) {
      return {
        status: 200,
        body: subscriber,
        cookies: [
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
