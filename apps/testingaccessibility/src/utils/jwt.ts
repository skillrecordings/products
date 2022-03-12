import jwt from 'jsonwebtoken'
import {JWT, JWTDecodeParams, JWTEncodeParams} from 'next-auth/jwt'

export const encodeTokenForHasura = async ({
  secret,
  token,
}: JWTEncodeParams) => {
  return jwt.sign(
    {
      ...token,
      iat: Date.now() / 1000,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user'],
        'x-hasura-default-role': 'user',
        'x-hasura-role': 'user',
        'x-hasura-user-id': token?.id,
      },
    } || '',
    secret,
    {algorithm: 'HS512'},
  )
}

export const decodeToken = async (params: JWTDecodeParams) => {
  const verify = jwt.verify(params.token || '', params.secret)
  return verify as JWT
}

export const signToken = async (token: JWT) => {
  return jwt.sign(token, process.env.NEXTAUTH_SECRET || '', {
    algorithm: 'HS256',
  })
}
