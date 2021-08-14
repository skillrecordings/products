import * as serverCookie from 'cookie'
import {CK_SUBSCRIBER_KEY} from 'contexts/convertkit-context'

const serializeCookie = (
  value: string,
  options?: serverCookie.CookieSerializeOptions,
) => {
  if (CK_SUBSCRIBER_KEY) {
    return serverCookie.serialize(CK_SUBSCRIBER_KEY, value, options)
  } else {
    console.error(
      'NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY is empty, please set it in your dot env file.',
    )
    return ''
  }
}

export default function serializeConvertkitCookie(subscriberId: string) {
  const hour = 3600000
  const oneYear = 365 * 24 * hour
  return serializeCookie(subscriberId, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/',
    maxAge: oneYear,
  })
}
