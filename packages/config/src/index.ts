export const AUTH_DOMAIN: string | undefined =
  process.env.NEXT_PUBLIC_AUTH_DOMAIN
export const AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID
export const AUTH_REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URI

export const CK_SUBSCRIBER_KEY =
  process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY || 'ck_subscriber_id'
export const CONVERTKIT_BASE_URL =
  process.env.CONVERTKIT_BASE_URL || 'https://api.convertkit.com/v3/'
export const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET
export const CONVERTKIT_TOKEN = process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN
export const CONVERTKIT_SIGNUP_FORM =
  process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM
export const CONVERTKIT_SUBSCRIBE_API_URL =
  process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBE_URL ||
  '/api/convertkit/subscribe'

// TODO: create unique keys for site authorization
export const USER_KEY = process.env.NEXT_PUBLIC_USER_KEY || 'user'
export const ACCESS_TOKEN_KEY =
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'access_token'
export const EXPIRES_AT_KEY =
  process.env.NEXT_PUBLIC_EXPIRES_AT_KEY || 'expires_at'
export const VIEWING_AS_USER_KEY =
  process.env.NEXT_PUBLIC_VIEWING_AS_USER_KEY || 'viewing_as_user'
