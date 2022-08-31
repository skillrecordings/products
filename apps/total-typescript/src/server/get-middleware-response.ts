import {rewriteToPath} from './rewrite-next-response-to-path'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import {NextRequest, NextResponse} from 'next/server'
import {getFreeLessons} from 'lib/lessons'
import {fetchConvertkitSubscriber} from './fetch-convertkit-subscriber'

export const ZOD_TUTORIAL_PAGE_PATH = '/tutorials/zod/'

export async function getMiddlewareResponse(req: NextRequest) {
  let response = NextResponse.next()

  if (req.nextUrl.pathname.startsWith(ZOD_TUTORIAL_PAGE_PATH)) {
    const convertkitId = req.cookies.get(CK_SUBSCRIBER_KEY)
    const subscriber = await fetchConvertkitSubscriber(convertkitId)
    const hasSubscribed = Boolean(subscriber)
    const freeLessons = await getFreeLessons()

    if (freeLessons.some(({slug}) => req.nextUrl.pathname.endsWith(slug))) {
      return response
    }

    if (hasSubscribed) {
      if (subscriber.state === 'inactive') {
        const baseUrlForRewrites = req.nextUrl.clone()
        console.log(baseUrlForRewrites)
        return (response = NextResponse.rewrite(
          baseUrlForRewrites.origin +
            `/confirm?source=video&email=${subscriber.email_address}`,
        ))
      } else {
        return response
      }
    }

    response = rewriteToPath(req.nextUrl.pathname + '/blocked', req)
  }

  return response
}
