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

  // New dynamic redirect for tutorials
  if (req.nextUrl.pathname.startsWith('/tutorials/build-react-hooks/')) {
    const segments = req.nextUrl.pathname.split('/')
    const filteredSegments = segments.filter((segment) => segment !== '')

    // Find the index of 'build-react-hooks'
    const buildReactHooksIndex = filteredSegments.findIndex(
      (segment) => segment === 'build-react-hooks',
    )

    // Check if there's a segment after 'build-react-hooks' to remove
    if (
      buildReactHooksIndex !== -1 &&
      filteredSegments.length > buildReactHooksIndex + 3
    ) {
      // Remove the segment immediately after 'build-react-hooks'
      const newSegments = [
        ...filteredSegments.slice(0, buildReactHooksIndex + 1),
        ...filteredSegments.slice(buildReactHooksIndex + 2),
      ]

      const newPath = '/' + newSegments.join('/')

      // Only redirect if the path has changed
      if (req.nextUrl.pathname !== newPath) {
        try {
          return redirectToPath(newPath, req)
        } catch (error) {
          return response
        }
      } else {
        console.log('URL already in correct format, no redirect needed')
      }
    } else {
      console.log('No segment to remove or URL already in correct format')
    }

    return response
  }

  return response
}
