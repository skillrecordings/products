import {ConvertkitSubscriber} from '../types'
import queryString from 'query-string'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'

export const redirectUrlBuilder = (
  subscriber: ConvertkitSubscriber,
  path: string,
  queryParams?: {
    [key: string]: string
  },
) => {
  const url = queryString.stringifyUrl({
    url: path,
    query: {
      [CK_SUBSCRIBER_KEY]: subscriber.id,
      email: subscriber.email,
      ...queryParams,
    },
  })
  return url
}
