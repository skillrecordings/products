import {SkillRecordingsHandlerParams} from '../../types'
import {OutgoingResponse} from '../../index'

const convertkitBaseUrl =
  process.env.CONVERTKIT_BASE_URL || 'https://api.convertkit.com/v3/'

export async function subscribeToConvertkit({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const {
      email,
      first_name,
      fields,
      form = process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM,
      tag,
      sequence,
    } = params.req.body
    const getEndpoint = () => {
      if (tag) {
        return `${convertkitBaseUrl}/tags/${tag}/subscribe`
      }
      if (sequence) {
        return `${convertkitBaseUrl}/sequences/${sequence}/subscribe`
      }
      return `${convertkitBaseUrl}/forms/${form}/subscribe`
    }
    const subscriber = await fetch(getEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        email,
        first_name,
        fields,
        api_key: process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN,
      }),
    })
      .then((res) => res.json())
      .then(({subscription}) => {
        return subscription.subscriber
      })

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
            maxAge: 31556952,
          },
        },
        {
          name: 'ck_subscriber',
          value: JSON.stringify(subscriber),
          options: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
            maxAge: 31556952,
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
