import {NextResponse} from 'next/server'
import type {NextFetchEvent, NextRequest} from 'next/server'
import {NextApiRequest} from 'next'
import {getToken} from 'next-auth/jwt'

export async function middleware(req: NextApiRequest, ev: NextFetchEvent) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // You could also check for any property on the session object,
  // like role === "admin" or name === "John Doe", etc.
  if (!session)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`)

  const canViewInvoice = session.purchases.some((purchase: any) => {
    return purchase.merchantChargeId !== null
  })
  if (!canViewInvoice)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/learn`)

  // If user is authenticated, continue.
  return NextResponse.next()
}
