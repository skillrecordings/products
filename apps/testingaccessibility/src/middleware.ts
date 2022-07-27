import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {getToken} from 'next-auth/jwt'
import {getCurrentAbility} from './server/ability'

const INVOICE_PAGE_PATH = '/invoices'
const CONTENT_ROOT_PATH = '/learn'
const WELCOME_PATH = '/welcome'
const TEAM_PATH = '/team'

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req: req as any,
  })

  const pathName = req.nextUrl.pathname
  const ability = getCurrentAbility((token as any) || {})

  if (pathName.startsWith(INVOICE_PAGE_PATH)) {
    if (ability.can('view', 'Invoice')) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL))
    }
  }

  if (pathName.startsWith(TEAM_PATH)) {
    if (ability.can('invite', 'Team')) {
      return NextResponse.next()
    } else {
      if (ability.can('view', 'Content')) {
        return NextResponse.redirect(
          new URL('/learn', process.env.NEXTAUTH_URL),
        )
      } else {
        return NextResponse.redirect(
          new URL('/login', process.env.NEXTAUTH_URL),
        )
      }
    }
  }

  if (pathName.startsWith(CONTENT_ROOT_PATH)) {
    if (ability.can('view', 'Content')) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL))
    }
  }

  if (
    pathName.startsWith(CONTENT_ROOT_PATH) ||
    pathName.startsWith(WELCOME_PATH)
  ) {
    if (ability.can('view', 'Account')) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL))
    }
  }

  return NextResponse.next()
}
