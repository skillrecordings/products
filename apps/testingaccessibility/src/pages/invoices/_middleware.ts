import {NextResponse} from 'next/server'
import type {NextFetchEvent, NextRequest} from 'next/server'
import {NextApiRequest} from 'next'
import {getDecodedToken} from '../../utils/get-decoded-token'

export async function middleware(req: NextApiRequest, ev: NextFetchEvent) {
  const session = await getDecodedToken(req)

  // You could also check for any property on the session object,
  // like role === "admin" or name === "John Doe", etc.
  if (!session)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`)

  // If user is authenticated, continue.
  return NextResponse.next()
}
