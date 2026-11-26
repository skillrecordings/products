import {createHmac, timingSafeEqual} from 'crypto'

/**
 * Deepgram's async callbacks carry no signature, so the callback URL carries
 * one: an HMAC binding the callback to one video resource and an expiry. The
 * webhook refuses a callback without a valid, unexpired signature, so nobody
 * who merely knows a videoResource _id can write its transcript (sec-166).
 * Same shape as course-builder's transcription-callback signature (sec-059).
 */
const LABEL = 'epic-web:deepgram-callback:v1:'

/** Longer than Deepgram's worst-case turnaround for a long video. */
export const DEEPGRAM_CALLBACK_TTL_SECONDS = 24 * 60 * 60

/** Clock skew allowed between the host that signs and the host that verifies. */
const SKEW_SECONDS = 5 * 60

export function signDeepgramCallback(
  secret: string,
  videoResourceId: string,
  expiresAt: number,
): string {
  return createHmac('sha256', secret)
    .update(`${LABEL}${videoResourceId}:${expiresAt}`)
    .digest('hex')
}

/**
 * Constant-time check. Refuses a missing secret, a missing or malformed
 * signature, and an expired or implausibly distant expiry.
 */
export function verifyDeepgramCallback(
  secret: string | undefined,
  videoResourceId: string,
  signature: unknown,
  expiresAt: unknown,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): boolean {
  if (!secret) return false
  if (typeof signature !== 'string' || !/^[0-9a-f]{64}$/.test(signature))
    return false
  if (typeof expiresAt !== 'string' || !/^\d{1,12}$/.test(expiresAt))
    return false
  const exp = Number(expiresAt)
  if (
    exp < nowSeconds ||
    exp > nowSeconds + DEEPGRAM_CALLBACK_TTL_SECONDS + SKEW_SECONDS
  )
    return false
  const expected = Buffer.from(
    signDeepgramCallback(secret, videoResourceId, exp),
    'hex',
  )
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'))
}

/** The query parameters to add to a callback URL for this resource. */
export function deepgramCallbackParams(
  secret: string,
  videoResourceId: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): {exp: string; sig: string} {
  const exp = nowSeconds + DEEPGRAM_CALLBACK_TTL_SECONDS
  return {
    exp: String(exp),
    sig: signDeepgramCallback(secret, videoResourceId, exp),
  }
}
