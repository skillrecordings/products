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

    const fullSubscriber = await fetchSubscriber(subscriber.id.toString())
    const fullSubscriberWithoutEmptyFields = filterNullFields(fullSubscriber)

    if (fields) {
      await setConvertkitSubscriberFields(fullSubscriber, fields)
    }

    return {
      status: 200,
      body: subscriber,
      cookies: getConvertkitSubscriberCookie(fullSubscriberWithoutEmptyFields),
    }
  } catch (error) {
    console.log('CK Error', error)
    return {
      status: 200,
    }
  }
}

type Subscriber = Record<string, any>

function filterNullFields(obj: Subscriber): Subscriber {
  const filteredObj: Subscriber = {}

  for (const key in obj) {
    if (obj[key] !== null) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        filteredObj[key] = filterNullFields(obj[key] as Subscriber) // Recursively filter nested objects
      } else {
        filteredObj[key] = obj[key]
      }
    }
  }

  return filteredObj
}
