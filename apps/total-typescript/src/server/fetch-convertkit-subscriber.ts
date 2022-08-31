import {
  CONVERTKIT_BASE_URL,
  CONVERTKIT_API_SECRET,
} from '@skillrecordings/config'

export const fetchConvertkitSubscriber = async (convertkitId?: string) =>
  await fetch(
    `${CONVERTKIT_BASE_URL}/subscribers/${convertkitId}?api_secret=${CONVERTKIT_API_SECRET}`,
  )
    .then((response) => response.json())
    .then((data: any) => data.subscriber)
