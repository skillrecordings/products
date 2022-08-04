import {Cookie} from '../core/lib/cookie'
import {NextApiResponse} from 'next'
import {serialize} from 'cookie'

export function setCookie(res: NextApiResponse, cookie: Cookie) {
  // Preserve any existing cookies that have already been set in the same session
  let setCookieHeader = res.getHeader('Set-Cookie') ?? []
  // If not an array (i.e. a string with a single cookie) convert it into an array
  if (!Array.isArray(setCookieHeader)) {
    setCookieHeader = [String(setCookieHeader)]
  }
  const {name, value, options} = cookie
  const cookieHeader = serialize(name, value, options)
  setCookieHeader.push(cookieHeader)
  res.setHeader('Set-Cookie', setCookieHeader)
}
