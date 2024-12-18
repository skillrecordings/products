import {NextResponse} from 'next/server'
import {Subscriber} from 'schemas/subscriber'

export function setUserCookie(res: NextResponse, subscriber: Subscriber) {
  if (subscriber) {
    res.cookies.set('ck_subscriber', JSON.stringify(deepOmitNull(subscriber)), {
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
  res.cookies.delete('ck_subscriber')
}

function deepOmitNull(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepOmitNull).filter((x) => x !== null)
  }

  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleaned = deepOmitNull(value)
      if (cleaned !== null) {
        acc[key] = cleaned
      }
      return acc
    }, {} as Record<string, any>)
  }

  return obj === null ? undefined : obj
}
