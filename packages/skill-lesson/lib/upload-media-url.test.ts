import {
  presignUploadGet,
  redactPresignedUrls,
  UPLOAD_GET_TTL_SECONDS,
  uploadObjectFromUrl,
} from './upload-media-url'

const env = {
  AWS_VIDEO_UPLOAD_BUCKET: 'uploads-bucket',
  AWS_VIDEO_UPLOAD_REGION: 'us-east-1',
  AWS_VIDEO_UPLOAD_ACCESS_KEY_ID: 'test-access-key-id',
  AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY: 'example-secret-not-real',
}
const objectUrl =
  'https://uploads-bucket.s3.us-east-1.amazonaws.com/partner-uploads/1b2c/clip.mp4'

describe('uploadObjectFromUrl', () => {
  test('reads a virtual-hosted object URL in the upload folder', () => {
    expect(uploadObjectFromUrl(objectUrl, env)).toEqual({
      bucket: 'uploads-bucket',
      region: 'us-east-1',
      key: 'partner-uploads/1b2c/clip.mp4',
    })
  })

  test('reads a path-style object URL and decodes the key', () => {
    expect(
      uploadObjectFromUrl(
        'https://s3.us-east-1.amazonaws.com/uploads-bucket/partner-uploads/x/My%20Clip.mp4',
        env,
      )?.key,
    ).toBe('partner-uploads/x/My Clip.mp4')
  })

  test.each([
    [
      'another bucket',
      'https://other.s3.us-east-1.amazonaws.com/partner-uploads/a.mp4',
    ],
    [
      'another folder',
      'https://uploads-bucket.s3.us-east-1.amazonaws.com/private/a.mp4',
    ],
    ['an already signed URL', `${objectUrl}?X-Amz-Signature=abc`],
    ['plain http', objectUrl.replace('https:', 'http:')],
    [
      'a parent segment',
      'https://uploads-bucket.s3.us-east-1.amazonaws.com/partner-uploads/../private/a.mp4',
    ],
    [
      'credentials in the URL',
      'https://u:p@uploads-bucket.s3.us-east-1.amazonaws.com/partner-uploads/a.mp4',
    ],
    ['a Mux rendition', 'https://stream.mux.com/pb/low.mp4?download=v1'],
    ['not a URL', 'partner-uploads/a.mp4'],
  ])('ignores %s', (_label, url) => {
    expect(uploadObjectFromUrl(url, env)).toBeNull()
  })

  test('ignores everything when the upload bucket is not configured', () => {
    expect(uploadObjectFromUrl(objectUrl, {})).toBeNull()
  })
})

describe('presignUploadGet', () => {
  test('signs a GET for an upload object with a short expiry', async () => {
    const signed = await presignUploadGet(objectUrl, {env})
    const url = new URL(signed)
    expect(url.origin + url.pathname).toBe(objectUrl)
    expect(url.searchParams.get('X-Amz-Signature')).toMatch(/^[0-9a-f]{64}$/)
    expect(url.searchParams.get('X-Amz-Expires')).toBe(
      String(UPLOAD_GET_TTL_SECONDS),
    )
    expect(signed).not.toContain(env.AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY)
  })

  test('honours a longer TTL when asked', async () => {
    const signed = await presignUploadGet(objectUrl, {env, ttlSeconds: 86400})
    expect(new URL(signed).searchParams.get('X-Amz-Expires')).toBe('86400')
  })

  test('returns any other URL unchanged without signing', async () => {
    const sign = jest.fn()
    const mux = 'https://stream.mux.com/pb/low.mp4'
    expect(await presignUploadGet(mux, {env, sign})).toBe(mux)
    expect(sign).not.toHaveBeenCalled()
  })

  test('warns when an upload-bucket S3 URL goes out unsigned', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    expect(await presignUploadGet(objectUrl, {env: {}})).toBe(objectUrl)
    expect(warn).toHaveBeenCalledWith(
      'video-upload.presign-skipped',
      expect.objectContaining({
        reason: 'upload bucket or region not configured',
      }),
    )
    warn.mockRestore()
  })

  test('names malformed percent-encoding', async () => {
    await expect(
      presignUploadGet(
        'https://uploads-bucket.s3.us-east-1.amazonaws.com/partner-uploads/%E0%A4%A.mp4',
        {env},
      ),
    ).rejects.toThrow(/malformed percent-encoding/)
  })

  test('refuses to sign without the upload credentials', async () => {
    await expect(
      presignUploadGet(objectUrl, {
        env: {...env, AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY: ''},
      }),
    ).rejects.toThrow(/AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY/)
  })
})

describe('redactPresignedUrls', () => {
  test('strips raw presigned queries from nested strings', () => {
    const signed = `${objectUrl}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=test%2F&X-Amz-Signature=abc123`
    const out = redactPresignedUrls({
      err: `could not fetch ${signed}.`,
      nested: [{url: signed}],
      request_id: 'req-1',
    })
    expect(JSON.stringify(out)).not.toMatch(/X-Amz-(Signature|Credential)/)
    expect(out.request_id).toBe('req-1')
  })

  test('strips an URL-encoded presigned URL inside another query string', () => {
    const inner = `${objectUrl}?X-Amz-Credential=test%2F&X-Amz-Signature=abc`
    const order = `https://castingwords.com/store/API4/order_url?sku=BULK2&url=${encodeURIComponent(
      inner,
    )}&test=1`
    const out = redactPresignedUrls(order)
    expect(out).not.toMatch(/X-Amz-(Signature|Credential)/)
    expect(out).toContain('sku=BULK2')
    expect(out).toContain('&test=1')
  })
})
