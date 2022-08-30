import {rewriteToPath} from './rewrite-next-response-to-path'
import {NextRequest, NextResponse} from 'next/server'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import {
  checkIfConvertkitSubscriber,
  fetchConvertkitSubscriberFromServerCookie,
} from '@skillrecordings/convertkit'

export const ZOD_TUTORIAL_PAGE_PATH = '/tutorials/zod/'

/**
 * with this approach, logged in users can be shown
 * '/' and anon users '/signup' IN PLACE
 *
 * This looks a lot like the i18n example:
 * https://github.com/vercel/examples/tree/main/edge-functions/i18n
 *
 * an the split testing example that puts them in a bucket:
 * https://github.com/vercel/examples/edge-functions/ab-testing-simple
 *
 */
export async function getMiddlewareResponse(req: NextRequest) {
  let response = NextResponse.next()

  const hasSubscribed = Boolean(req.cookies.get(CK_SUBSCRIBER_KEY))

  if (req.nextUrl.pathname.startsWith(ZOD_TUTORIAL_PAGE_PATH)) {
    switch (true) {
      case req.nextUrl.pathname.includes('number'):
        response = NextResponse.next()
        break
      case hasSubscribed:
        response = NextResponse.next()
        break
      default:
        response = rewriteToPath(req.nextUrl.pathname + '/blocked', req)
    }
  }

  return response
}
