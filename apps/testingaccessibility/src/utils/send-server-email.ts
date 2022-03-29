import {NextAuthOptions} from 'next-auth'
import {nextAuthOptions} from '../pages/api/auth/[...nextauth]'
import {createHash, randomBytes} from 'crypto'

const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL

export async function sendServerEmail({
  email,
  callbackUrl,
}: {
  email: string
  callbackUrl?: string
}) {
  const signInUrl = `${baseUrl}/api/auth/signin/email`
  const url = parseUrl(`${baseUrl}/api/auth`)
  const secret = createSecret({userOptions: nextAuthOptions, url})
  const {cookie} = createCSRFToken({options: {secret}, isPost: false})
  const cookieHeader = `next-auth.csrf-token=${cookie}`
  const clientToken = await getClientCsrfToken(cookieHeader)

  return await fetch(signInUrl, {
    method: 'post',
    headers: {
      Cookie: cookieHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // @ts-expect-error
    body: new URLSearchParams({
      email,
      csrfToken: clientToken,
      callbackUrl: callbackUrl || baseUrl,
      json: true,
    }),
  }).then((response) => response.json())
}

export async function getClientCsrfToken(Cookie: string) {
  const {csrfToken} = await fetch(`${baseUrl}/api/auth/csrf`, {
    method: 'get',
    headers: {
      Cookie,
    },
  }).then((response) => response.json())

  return csrfToken
}

function createCSRFToken({options, cookieValue, isPost, bodyValue}: any) {
  if (cookieValue) {
    const [csrfToken, csrfTokenHash] = cookieValue.split('|')
    const expectedCsrfTokenHash = createHash('sha256')
      .update(`${csrfToken}${options.secret}`)
      .digest('hex')
    if (csrfTokenHash === expectedCsrfTokenHash) {
      // If hash matches then we trust the CSRF token value
      // If this is a POST request and the CSRF Token in the POST request matches
      // the cookie we have already verified is the one we have set, then the token is verified!
      const csrfTokenVerified = isPost && csrfToken === bodyValue

      return {csrfTokenVerified, csrfToken}
    }
  }

  // New CSRF token
  const csrfToken = randomBytes(32).toString('hex')
  const csrfTokenHash = createHash('sha256')
    .update(`${csrfToken}${options.secret}`)
    .digest('hex')
  const cookie = `${csrfToken}|${csrfTokenHash}`

  return {cookie, csrfToken}
}

function createSecret(params: {userOptions: NextAuthOptions; url: any}) {
  const {userOptions, url} = params

  return (
    userOptions.secret ??
    createHash('sha256')
      .update(JSON.stringify({...url, ...userOptions}))
      .digest('hex')
  )
}

interface InternalUrl {
  /** @default "http://localhost:3000" */
  origin: string
  /** @default "localhost:3000" */
  host: string
  /** @default "/api/auth" */
  path: string
  /** @default "http://localhost:3000/api/auth" */
  base: string
  /** @default "http://localhost:3000/api/auth" */
  toString: () => string
}

/** Returns an `URL` like object to make requests/redirects from server-side */
function parseUrl(url?: string): InternalUrl {
  const defaultUrl = new URL('http://localhost:3000/api/auth')

  if (url && !url.startsWith('http')) {
    url = `https://${url}`
  }

  const _url = new URL(url ?? defaultUrl)
  const path = (_url.pathname === '/' ? defaultUrl.pathname : _url.pathname)
    // Remove trailing slash
    .replace(/\/$/, '')

  const base = `${_url.origin}${path}`

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  }
}
