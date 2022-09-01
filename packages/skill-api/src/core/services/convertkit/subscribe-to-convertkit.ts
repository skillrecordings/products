import {SkillRecordingsHandlerParams} from '../../types'
import {OutgoingResponse} from '../../index'
import {
  fetchSubscriber,
  subscribeToEndpoint,
  getConvertkitSubscriberCookie,
  setConvertkitSubscriberFields,
} from '@skillrecordings/convertkit-sdk'

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
        return `/tags/${tag}/subscribe`
      }
      if (sequence) {
        return `/sequences/${sequence}/subscribe`
      }
      return `/forms/${form}/subscribe`
    }
    const subscriber = await subscribeToEndpoint(getEndpoint(), {
      email,
      first_name,
      fields,
    })

    if (fields) {
      const subscriberWithFields = await fetchSubscriber(
        subscriber.id.toString(),
      )
      await setConvertkitSubscriberFields(subscriberWithFields, fields)
    }

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
