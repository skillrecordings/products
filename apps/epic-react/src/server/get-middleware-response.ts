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

  return response
}
