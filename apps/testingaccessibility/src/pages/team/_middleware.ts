import type {NextFetchEvent} from 'next/server'
import {NextResponse} from 'next/server'
import {getToken} from 'next-auth/jwt'
import {NextApiRequest} from 'next'

export async function middleware(req: NextApiRequest, ev: NextFetchEvent) {
  const session: any = await getToken({req})

  if (!session)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`)

  // Ideally this would use hasBulkPurchase() from utils/purchase-validators.ts
  // but that was throwing an error "Dynamic Code Evaluation (e. g. 'eval',
  // 'new Function') not allowed in Middleware pages/team/_middleware"
  // likely because of lodash
  const hasBulkPurchase = session.purchases.some((purchase: any) => {
    return purchase.bulkCoupon !== null
  })

  if (!hasBulkPurchase)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/learn`)

  // If user is authenticated and has bulk purchase, continue.
  return NextResponse.next()
}
