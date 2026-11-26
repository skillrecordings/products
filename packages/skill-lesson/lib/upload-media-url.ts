import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

/**
 * Mux and Deepgram fetch an upload once, when the job starts. Six hours covers
 * a slow queue; every call signs again, so no URL needs to outlive it.
 */
export const UPLOAD_GET_TTL_SECONDS = 6 * 60 * 60

export type UploadBucketEnv = {
  AWS_VIDEO_UPLOAD_BUCKET?: string
  AWS_VIDEO_UPLOAD_REGION?: string
  AWS_VIDEO_UPLOAD_FOLDER?: string
  AWS_VIDEO_UPLOAD_ACCESS_KEY_ID?: string
  AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY?: string
  [name: string]: string | undefined
}

export type UploadObject = {bucket: string; region: string; key: string}

export type SignUploadGet = (
  object: UploadObject,
  options: {expiresIn: number; env: UploadBucketEnv},
) => Promise<string>

/**
 * Returns the bucket, region and key when `url` is an unsigned object URL in
 * this app's upload bucket and folder, else null. Accepts virtual-hosted and
 * path-style S3 hosts. A URL with a query string is not an unsigned object URL.
 *
 * @example
 * uploadObjectFromUrl('https://b.s3.us-east-1.amazonaws.com/partner-uploads/x/a.mp4', env)
 * // {bucket: 'b', region: 'us-east-1', key: 'partner-uploads/x/a.mp4'}
 */
export function uploadObjectFromUrl(
  url: string,
  env: UploadBucketEnv = process.env,
): UploadObject | null {
  const bucket = env.AWS_VIDEO_UPLOAD_BUCKET
  const region = env.AWS_VIDEO_UPLOAD_REGION
  if (!bucket || !region) return null
  const folder = (env.AWS_VIDEO_UPLOAD_FOLDER || 'partner-uploads').replace(
    /\/+$/,
    '',
  )

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:' || parsed.search || parsed.username)
    return null

  const host = parsed.hostname.toLowerCase()
  let path: string
  try {
    path = decodeURIComponent(parsed.pathname.replace(/^\/+/, ''))
  } catch {
    throw new Error(
      `Upload URL path has malformed percent-encoding and cannot be signed: ${parsed.origin}${parsed.pathname}`,
    )
  }
  let key: string | null = null
  if (
    host === `${bucket}.s3.${region}.amazonaws.com` ||
    host === `${bucket}.s3.amazonaws.com`
  ) {
    key = path
  } else if (
    (host === `s3.${region}.amazonaws.com` || host === 's3.amazonaws.com') &&
    path.startsWith(`${bucket}/`)
  ) {
    key = path.slice(bucket.length + 1)
  }

  if (!key || !key.startsWith(`${folder}/`) || key.split('/').includes('..'))
    return null
  return {bucket, region, key}
}

const defaultSign: SignUploadGet = async (object, {expiresIn, env}) => {
  const client = new S3Client({
    region: object.region,
    credentials: {
      accessKeyId: env.AWS_VIDEO_UPLOAD_ACCESS_KEY_ID ?? '',
      secretAccessKey: env.AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY ?? '',
    },
  })
  return getSignedUrl(
    client,
    new GetObjectCommand({Bucket: object.bucket, Key: object.key}),
    {expiresIn},
  )
}

/**
 * The URL a media service should fetch. An unsigned object URL in this app's
 * upload bucket becomes a short-lived presigned GET, because the bucket no
 * longer serves uploads publicly (sec-165). Any other URL comes back unchanged.
 *
 * Call it at the moment of the service call, never as an Inngest step of its
 * own: the signed URL is a bearer credential, so it must not land in step
 * output, event data, Sanity or logs, and a retry must sign again.
 *
 * @example
 * const input = await presignUploadGet(originalMediaUrl)
 * await Video.Assets.create({input, playback_policy: ['public']})
 */
export async function presignUploadGet(
  url: string,
  options: {
    env?: UploadBucketEnv
    ttlSeconds?: number
    sign?: SignUploadGet
  } = {},
): Promise<string> {
  const env = options.env ?? process.env
  const object = uploadObjectFromUrl(url, env)
  if (!object) {
    warnIfUnsignedS3(url, env)
    return url
  }
  if (
    !env.AWS_VIDEO_UPLOAD_ACCESS_KEY_ID ||
    !env.AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY
  ) {
    throw new Error(
      'AWS_VIDEO_UPLOAD_ACCESS_KEY_ID and AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY are required to sign an upload GET',
    )
  }
  return (options.sign ?? defaultSign)(object, {
    expiresIn: options.ttlSeconds ?? UPLOAD_GET_TTL_SECONDS,
    env,
  })
}

/**
 * A bare S3 URL that goes out unsigned fails at Mux or the transcriber with a
 * 403 once the bucket stops serving publicly. Say so here, where the cause is.
 */
function warnIfUnsignedS3(url: string, env: UploadBucketEnv) {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return
  }
  const host = parsed.hostname.toLowerCase()
  if (!host.endsWith('.amazonaws.com') || parsed.search) return
  const bucket = env.AWS_VIDEO_UPLOAD_BUCKET
  if (
    bucket &&
    !host.includes(bucket) &&
    !parsed.pathname.startsWith(`/${bucket}/`)
  )
    return
  console.warn('video-upload.presign-skipped', {
    host,
    reason:
      !bucket || !env.AWS_VIDEO_UPLOAD_REGION
        ? 'upload bucket or region not configured'
        : 'S3 URL not in the upload folder or in an unrecognised host form',
  })
}

const PRESIGNED_QUERY = /\?[^\s"'<>]*X-Amz-(?:Signature|Credential)=[^\s"'<>]*/g
const ENCODED_PRESIGNED_QUERY =
  /(?:%3F|\?)[^\s"'<>&]*X-Amz-(?:Signature|Credential)(?:%3D|=)[^\s"'<>&]*/gi

/**
 * Strips presigned query strings, raw or URL-encoded, from every string in a
 * value, so an error message or an API response that echoes the URL can be
 * stored or logged.
 *
 * @example
 * redactPresignedUrls({err: 'bad https://b/k?X-Amz-Signature=abc'})
 * // {err: 'bad https://b/k?[presigned query redacted]'}
 */
export function redactPresignedUrls<T>(value: T): T {
  if (typeof value === 'string')
    return value
      .replace(PRESIGNED_QUERY, '?[presigned query redacted]')
      .replace(ENCODED_PRESIGNED_QUERY, '?[presigned query redacted]') as T
  if (Array.isArray(value)) return value.map(redactPresignedUrls) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, redactPresignedUrls(v)]),
    ) as T
  }
  return value
}
