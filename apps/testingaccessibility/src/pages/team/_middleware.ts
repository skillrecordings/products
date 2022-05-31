import type {NextFetchEvent} from 'next/server'
import {NextResponse} from 'next/server'
import {getToken} from 'next-auth/jwt'
import {NextApiRequest} from 'next'
import {hasBulkPurchase} from 'utils/purchase-validators'

export async function middleware(req: NextApiRequest, ev: NextFetchEvent) {
  const session: any = await getToken({req})
  if (!session)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`)

  // If user is authenticated and can invite team, continue.
  return NextResponse.next()
}
