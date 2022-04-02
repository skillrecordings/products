import {getToken, JWT} from 'next-auth/jwt'
import type {NextApiRequest} from 'next'
import type {IncomingMessage} from 'http'
import type {NextApiRequestCookies} from 'next/dist/server/api-utils'

type GetDecodedTokenReq =
  | NextApiRequest
  | (IncomingMessage & {cookies: NextApiRequestCookies})

export function getDecodedToken(req: GetDecodedTokenReq) {
  return getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
}
