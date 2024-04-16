import {rewriteToPath} from './rewrite-next-response-to-path'
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
        response = rewriteToPath('/learn', req)
      }
    } catch (error) {
      return response
    }
  }

  return response
}
