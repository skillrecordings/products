import {isEmpty} from 'lodash'

const convertkitBaseUrl =
  process.env.CONVERTKIT_BASE_URL || 'https://api.convertkit.com/v3/'

export async function setConvertkitSubscriberFields(
  subscriberId: string,
  fields: Record<string, string>,
) {
  await fetch(`${convertkitBaseUrl}/subscribers/${subscriberId}`, {
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

export async function createConvertkitTag(questionId: string) {
  if (!process.env.CONVERTKIT_API_SECRET) {
    console.warn('set CONVERTKIT_API_SECRET')
    return
  }

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

export async function subscribeToTag(email: string, tagId: string) {
  if (!process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN) {
    console.warn('set NEXT_PUBLIC_CONVERTKIT_TOKEN')
    return
  }
  await fetch(`${convertkitBaseUrl}/tags/${tagId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      api_key: process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN,
      email,
    }),
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
    const response = await fetch(subscriberUrl).then((res) => res.json())
    subscriber = response.subscriber
  }

  if (isEmpty(subscriber)) return

  const tagsApiUrl = `${convertkitBaseUrl}/subscribers/${subscriber.id}/tags?api_key=${process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN}`
  const tags = await fetch(tagsApiUrl).then((res) => res.json())

  return {...subscriber, tags}
}
