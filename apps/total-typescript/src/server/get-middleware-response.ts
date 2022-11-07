import {rewriteToPath} from './rewrite-next-response-to-path'
import {NextRequest, NextResponse} from 'next/server'
import {
  getCookiesForRequest,
  setCookiesForResponse,
} from './process-customer-cookies'

export const SITE_ROOT_PATH = '/'

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
  const subscriber = await getCookiesForRequest(req)

  if (subscriber && req.nextUrl.pathname === SITE_ROOT_PATH) {
    switch (true) {
      case Boolean(subscriber.fields?.level):
        response = rewriteToPath(`/home/level/${subscriber.fields?.level}`, req)
        break
    }
  }

  response = setCookiesForResponse(response, subscriber)

  return response
}
