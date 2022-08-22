import {createCookie} from '@remix-run/node' // or cloudflare/deno

const hour = 3600000
export const oneYear = 365 * 24 * hour

export const convertkitSubscriberCookie = createCookie('ck_subscriber', {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  path: '/',
  maxAge: oneYear,
})
