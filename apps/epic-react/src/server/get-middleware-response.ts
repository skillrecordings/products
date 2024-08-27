import {redirectToPath} from './redirect-next-response-to-path'
import {NextRequest, NextResponse} from 'next/server'

import {getToken} from 'next-auth/jwt'
import {UserSchema} from '@skillrecordings/skill-lesson/utils/ability'

export const SITE_ROOT_PATH = '/'

export async function getMiddlewareResponse(req: NextRequest) {
  let response = NextResponse.next()
  const token = await getToken({req})

  if (req.nextUrl.pathname === SITE_ROOT_PATH) {
    try {
      const user = UserSchema.parse(token)
      if (user) {
        response = redirectToPath('/learn', req)
      }
    } catch (error) {
      return response
    }
  }

  if (req.nextUrl.pathname === '/login') {
    try {
      const user = UserSchema.parse(token)
      if (user) {
        response = redirectToPath('/learn', req)
      }
    } catch (error) {
      return response
    }
  }

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
