import {getToken, GetTokenParams} from 'next-auth/jwt'

export function getDecodedToken<R extends boolean = false>(
  params: GetTokenParams<R>,
) {
  return getToken({
    ...params,
    secret: params.secret || process.env.NEXTAUTH_SECRET,
  })
}
