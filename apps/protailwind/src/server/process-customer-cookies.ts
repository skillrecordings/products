import {NextRequest, NextResponse} from 'next/server'

import {clearUserCookie, setUserCookie} from './user-cookies'
import {type Subscriber, SubscriberSchema} from 'schemas/subscriber'

export async function getCookiesForRequest(req: NextRequest) {
  try {
    console.log(req.cookies)
    return SubscriberSchema.parse(
      JSON.parse(req.cookies.get('ck_subscriber') as string),
    )
  } catch (e) {
    return
  }
}

export function setCookiesForResponse(
  res: NextResponse,
  subscriber?: Subscriber,
) {
  if (subscriber) {
    try {
      setUserCookie(res, subscriber)
    } catch (e) {
      clearUserCookie(res)
      console.error('error setting user cookie', e)
    }
  } else {
    clearUserCookie(res)
  }

  return res
}
