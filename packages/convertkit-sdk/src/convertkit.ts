import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import {Cookie} from './cookie'
import fetch from 'node-fetch'

const convertkitBaseUrl =
  process.env.CONVERTKIT_BASE_URL || 'https://api.convertkit.com/v3/'

const hour = 3600000
export const oneYear = 365 * 24 * hour

export function getConvertkitSubscriberCookie(subscriber: any): Cookie[] {
  return [
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
    {
      name:
        process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY || 'ck_subscriber_id',
      value: subscriber.id,
      options: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        path: '/',
        maxAge: 31556952,
      },
    },
  ]
}

export async function subscribeToEndpoint(
  endPoint: string,
  params: Record<string, string>,
) {
  return await fetch(`${convertkitBaseUrl}${endPoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      ...params,
      api_key:
        process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN ||
        process.env.CONVERTKIT_PUBLIC_TOKEN,
    }),
  })
    .then((res) => res.json())
    .then(({subscription}: any) => {
      return subscription.subscriber
    })
}

export async function tagSubscriber(email: string, tagId: string) {
  const url = `${convertkitBaseUrl}/tags/${tagId}/subscribe`
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      email,
      api_key:
        process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN ||
        process.env.CONVERTKIT_PUBLIC_TOKEN,
    }),
  })
    .then((res) => res.json())
    .then(({subscription}: any) => {
      return subscription.subscriber
    })
}

export async function setConvertkitSubscriberFields(
  subscriber: {id: string},
  fields: Record<string, string>,
) {
  for (const field in fields) {
    await createConvertkitCustomField(field, subscriber)
  }
  await fetch(`${convertkitBaseUrl}/subscribers/${subscriber.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      api_secret: process.env.CONVERTKIT_API_SECRET,
      fields,
    }),
  })
}

export async function createConvertkitCustomField(
  questionId: string,
  subscriber: any,
) {
  try {
    if (!process.env.CONVERTKIT_API_SECRET) {
      console.warn('set CONVERTKIT_API_SECRET')
      return
    }

    const fieldExists = !isEmpty(
      find(Object.keys(subscriber.fields), (field) => field === questionId),
    )

    if (!fieldExists) {
      await fetch(`${convertkitBaseUrl}/custom_fields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          api_secret: process.env.CONVERTKIT_API_SECRET,
          label: questionId,
        }),
      })
    }
  } catch (e) {
    console.debug(`convertkit field not created: ${questionId}`)
  }
}

export async function subscribeToTag(email: string, tagId: string) {
  if (
    !process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN &&
    !process.env.CONVERTKIT_PUBLIC_TOKEN
  ) {
    console.warn('set NEXT_PUBLIC_CONVERTKIT_TOKEN or CONVERTKIT_PUBLIC_TOKEN')
    return
  }
  await fetch(`${convertkitBaseUrl}/tags/${tagId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      api_key:
        process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN ||
        process.env.CONVERTKIT_PUBLIC_TOKEN,
      email,
    }),
  })
}

export async function subscribeToForm(options: {
  email: string
  first_name?: string
  formId: string
  fields?: Record<string, string>
}) {
  console.log('subscribing to form')

  if (
    !process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN &&
    !process.env.CONVERTKIT_PUBLIC_TOKEN
  ) {
    console.warn('set NEXT_PUBLIC_CONVERTKIT_TOKEN or CONVERTKIT_PUBLIC_TOKEN')
    return
  }

  return fetch(`${convertkitBaseUrl}/forms/${options.formId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      api_key:
        process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN ||
        process.env.CONVERTKIT_PUBLIC_TOKEN,
      email: options.email,
      first_name: options.first_name,
      fields: options.fields,
    }),
  })
    .then((res) => res.json())
    .then(({subscription}: any) => {
      return subscription.subscriber
    })
}

export async function fetchSubscriber(convertkitId: string) {
  if (!process.env.CONVERTKIT_API_SECRET) {
    console.warn('set CONVERTKIT_API_SECRET')
    return
  }

  let subscriber

  if (convertkitId) {
    const subscriberUrl = `${convertkitBaseUrl}/subscribers/${convertkitId}?api_secret=${process.env.CONVERTKIT_API_SECRET}`
    subscriber = await fetch(subscriberUrl)
      .then((res) => res.json())
      .then(({subscription}: any) => {
        return subscription.subscriber
      })
  }

  if (isEmpty(subscriber)) return

  const tagsApiUrl = `${convertkitBaseUrl}/subscribers/${
    subscriber.id
  }/tags?api_key=${
    process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN ||
    process.env.CONVERTKIT_PUBLIC_TOKEN
  }`
  const tags = await fetch(tagsApiUrl).then((res) => res.json())

  return {...subscriber, tags}
}
