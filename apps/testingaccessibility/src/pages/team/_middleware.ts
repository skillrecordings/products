import type {NextFetchEvent} from 'next/server'
import {NextResponse} from 'next/server'
import {getToken} from 'next-auth/jwt'
import {NextApiRequest} from 'next'

export async function middleware(req: NextApiRequest, ev: NextFetchEvent) {
  const session: any = await getToken({req})

  if (!session)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`)

  const hasBulkPurchase = session.purchases.some((purchase: any) => {
    return purchase.bulkCoupon !== null
  })

  if (!hasBulkPurchase)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/learn`)

  // If user is authenticated and has bulk purchase, continue.
  return NextResponse.next()
}
