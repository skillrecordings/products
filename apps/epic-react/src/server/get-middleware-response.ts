import {redirectToPath} from './redirect-next-response-to-path'
import {NextRequest, NextResponse} from 'next/server'

export async function getMiddlewareResponse(req: NextRequest) {
  let response = NextResponse.next()

  if (req.nextUrl.pathname === '/podcast') {
    try {
      response = redirectToPath(
        '/podcast/kents-career-path-through-web-development',
        req,
      )
    } catch (error) {
      return response
    }
  }

  const sectionsToRedirect = [
    'introduction-build-react-hooks',
    'use-state',
    'multiple-hooks',
    'use-effect',
    'outro-build-react-hooks',
  ]

  if (req.nextUrl.pathname.startsWith('/tutorials/build-react-hooks/')) {
    const segments = req.nextUrl.pathname
      .split('/')
      .filter((segment) => segment !== '')

    if (segments.length >= 4 && sectionsToRedirect.includes(segments[2])) {
      const newSegments = [...segments.slice(0, 2), ...segments.slice(3)]

      const newPath = '/' + newSegments.join('/')

      if (newPath !== req.nextUrl.pathname) {
        try {
          return redirectToPath(newPath, req)
        } catch (error) {
          console.error('Redirect failed:', error)
          return response
        }
      }
    }
  }

  return response
}
