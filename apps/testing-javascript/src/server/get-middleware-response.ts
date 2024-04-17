import {rewriteToPath} from './rewrite-next-response-to-path'
import {NextRequest, NextResponse} from 'next/server'
import {getToken} from 'next-auth/jwt'
import {
  getCurrentAbility,
  UserSchema,
} from '@skillrecordings/skill-lesson/utils/ability'

export const SITE_ROOT_PATH = '/'

/**
 * with this approach, logged in users can be shown
 * '/' and anon users '/signup' IN PLACE
 *
 * This looks a lot like the i18n example:
 * https://github.com/vercel/examples/tree/main/edge-functions/i18n
 *
 * an the split testing example that puts them in a bucket:
 * https://github.com/vercel/examples/edge-functions/ab-testing-simple
 *
 */
export async function getMiddlewareResponse(req: NextRequest) {
  let response = NextResponse.next()
  const token = await getToken({req})

  if (req.nextUrl.pathname.includes('/admin')) {
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
