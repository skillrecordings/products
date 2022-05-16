import {getToken} from 'next-auth/jwt'
import {NextApiRequest} from 'next'

export function getDecodedToken(req: NextApiRequest) {
  return getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
}
