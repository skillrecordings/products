import {NextRequest, NextResponse} from 'next/server'
import {
  getMiddlewareResponse,
  SITE_ROOT_PATH,
} from './server/get-middleware-response'
import {getTutorial} from '@/lib/tutorials'
import {
  legacySectionlessRedirect,
  sectionlessPattern,
} from '@/lib/middleware.lib'

const PUBLIC_FILE = /\.(.*)$/

export const config = {
  matcher: [
    '/',
    '/admin',
    '/tutorials/([^/]+/[^/]+(?:/exercise)?(?:/solution)?)',
  ],
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (sectionlessPattern.test(url.pathname)) {
    return legacySectionlessRedirect(url)
  }

  // think favicon etc as PUBLIC_FILE
  if (PUBLIC_FILE.test(req.nextUrl.pathname)) return NextResponse.next()

  return getMiddlewareResponse(req)
}
