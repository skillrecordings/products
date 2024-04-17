import {NextRequest, NextResponse} from 'next/server'

export function redirectToPath(path: string, req: NextRequest) {
  const baseUrlForRedirect = req.nextUrl.clone()
  baseUrlForRedirect.pathname = path
  return NextResponse.redirect(baseUrlForRedirect)
}
