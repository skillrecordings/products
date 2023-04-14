import {NextRequest, NextResponse} from 'next/server'
import {getMiddlewareResponse} from './server/get-middleware-response'

const PUBLIC_FILE = /\.(.*)$/

export const config = {
  matcher: ['/'],
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  // think favicon etc as PUBLIC_FILE
  if (PUBLIC_FILE.test(req.nextUrl.pathname)) return NextResponse.next()

  return getMiddlewareResponse(req)
}
