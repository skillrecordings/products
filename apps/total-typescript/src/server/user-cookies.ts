import {NextResponse} from 'next/server'
import {Subscriber} from 'video/subscriber'

export function setUserCookie(res: NextResponse, subscriber: Subscriber) {
  if (subscriber) {
    res.cookies.set('ck_subscriber', JSON.stringify(subscriber), {
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 31556952,
    })
  } else {
    clearUserCookie(res)
  }
}

export function clearUserCookie(res: NextResponse) {
  res.cookies.delete('ck_subscriber', {
    domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
  })
}
