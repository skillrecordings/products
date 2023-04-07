import {rewriteToPath} from './rewrite-next-response-to-path'
import {NextRequest, NextResponse} from 'next/server'

import {getToken} from 'next-auth/jwt'
import {
  getCurrentAbility,
  UserSchema,
} from '@skillrecordings/skill-lesson/utils/ability'

export const SITE_ROOT_PATH = '/'

export async function getMiddlewareResponse(req: NextRequest) {
  let response = NextResponse.next()
  const token = await getToken({req})

  if (
    req.nextUrl.pathname.includes('/admin') ||
    req.nextUrl.pathname.includes('/tips')
  ) {
    try {
      const user = UserSchema.parse(token)
      const ability = getCurrentAbility({user})
      if (!ability.can('create', 'Content')) {
        response = rewriteToPath('/login', req)
      }
    } catch (error) {
      response = rewriteToPath('/login', req)
    }
  }

  return response
}
