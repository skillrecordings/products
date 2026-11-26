// sec-167: the CastingWords webhook is unauthenticated, so it may only write a
// transcript to the video resource holding the exact order and audiofile pair
// we stored when ordering, and Mux never sees a URL carrying our API key.
const mockFetchDoc = jest.fn()
const mockCommit = jest.fn()
const mockAssetGet = jest.fn()
const mockCreateTrack = jest.fn()
jest.mock('../utils/sanity-server', () => ({
  sanityWriteClient: {
    fetch: (...args: unknown[]) => mockFetchDoc(...args),
    patch: () => ({set: () => ({commit: () => mockCommit()})}),
  },
}))
jest.mock('@mux/mux-node', () =>
  jest.fn().mockImplementation(() => ({
    Video: {
      Assets: {
        get: (...args: unknown[]) => mockAssetGet(...args),
        createTrack: (...args: unknown[]) => mockCreateTrack(...args),
      },
    },
  })),
)

import {S3Client} from '@aws-sdk/client-s3'
import {castingwordsWebhookReceiver} from './castingwords'

const saved = {...process.env}
type FetchReply = {ok: boolean; status: number; text: () => Promise<string>}
const castingwordsFetch = jest.fn(
  async (url: string): Promise<FetchReply> => ({
    ok: true,
    status: 200,
    text: async () =>
      url.includes('.srt') ? '1\n00:00:00,000 --> 00:00:01,000\nhi' : 'hi',
  }),
)
let s3Send: jest.SpyInstance

beforeEach(() => {
  jest.clearAllMocks()
  process.env = {
    ...saved,
    CASTINGWORDS_API_TOKEN: 'cw-secret-token',
    AWS_VIDEO_UPLOAD_BUCKET: 'uploads-bucket',
    AWS_VIDEO_UPLOAD_REGION: 'us-east-1',
    AWS_VIDEO_UPLOAD_ACCESS_KEY_ID: 'test-access-key-id',
    AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY: 'example-secret-not-real',
  }
  global.fetch = castingwordsFetch as never
  s3Send = jest.spyOn(S3Client.prototype, 'send').mockResolvedValue({} as never)
  mockAssetGet.mockResolvedValue({tracks: [], duration: 42})
  mockCommit.mockResolvedValue({})
})

afterAll(() => {
  process.env = saved
})

async function post(body: Record<string, unknown>) {
  const res: any = {code: 0}
  res.status = (code: number) => {
    res.code = code
    return res
  }
  res.json = () => res
  res.end = () => res
  await castingwordsWebhookReceiver(
    {method: 'POST', body: {event: 'TRANSCRIPT_COMPLETE', ...body}} as never,
    res as never,
  )
  return res
}

test('looks the resource up by parameters, never by interpolating the body', async () => {
  mockFetchDoc.mockResolvedValue(null)
  const injection = 'x" || true || "'
  const res = await post({audiofile: '123', order: injection})
  const [query, params] = mockFetchDoc.mock.calls[0]
  expect(query).not.toContain(injection)
  expect(query).toContain('$order')
  expect(query).toContain('$audiofile')
  expect(params).toEqual({
    order: injection,
    audiofile: '123',
    audiofileNumber: 123,
  })
  expect(res.code).toBe(404)
})

test('writes nothing and calls nothing for an unmatched order and audiofile pair', async () => {
  mockFetchDoc.mockResolvedValue(null)
  const res = await post({audiofile: '999', order: 'real-order'})
  expect(res.code).toBe(404)
  expect(castingwordsFetch).not.toHaveBeenCalled()
  expect(mockCommit).not.toHaveBeenCalled()
  expect(mockCreateTrack).not.toHaveBeenCalled()
})

test('a matched pair writes the transcript and gives Mux our own presigned caption URL', async () => {
  mockFetchDoc.mockResolvedValue({
    _id: 'vr-1',
    originalMediaUrl: 'https://example.com/a.mp4',
    castingwords: {orderId: 'real-order', audioFileId: '123'},
    muxAsset: {muxAssetId: 'mux-1'},
  })
  const res = await post({audiofile: '123', order: 'real-order'})
  expect(res.code).toBe(200)
  expect(mockCommit).toHaveBeenCalledTimes(1)

  const put = s3Send.mock.calls[0][0].input
  expect(put).toMatchObject({
    Bucket: 'uploads-bucket',
    Key: 'partner-uploads/captions/vr-1/123.srt',
  })
  expect(put.Body).toContain('00:00:01,000')

  const {url} = mockCreateTrack.mock.calls[0][1]
  expect(
    url.startsWith(
      'https://uploads-bucket.s3.us-east-1.amazonaws.com/partner-uploads/captions/vr-1/123.srt?',
    ),
  ).toBe(true)
  expect(url).toMatch(/X-Amz-Signature=[0-9a-f]{64}/)
  expect(url).not.toContain('castingwords.com')
  expect(url).not.toContain('cw-secret-token')
})

test('writes nothing when CastingWords answers with an error page', async () => {
  castingwordsFetch.mockImplementationOnce(async () => ({
    ok: false,
    status: 401,
    text: async () => '<html>bad api key</html>',
  }))
  mockFetchDoc.mockResolvedValue({
    _id: 'vr-1',
    originalMediaUrl: 'https://example.com/a.mp4',
    castingwords: {orderId: 'real-order', audioFileId: '123'},
    muxAsset: {muxAssetId: 'mux-1'},
  })
  const res = await post({audiofile: '123', order: 'real-order'})
  expect(res.code).toBe(500)
  expect(mockCommit).not.toHaveBeenCalled()
  expect(mockCreateTrack).not.toHaveBeenCalled()
})

test('creates no caption track rather than leak when the bucket is not configured', async () => {
  delete process.env.AWS_VIDEO_UPLOAD_BUCKET
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  mockFetchDoc.mockResolvedValue({
    _id: 'vr-1',
    originalMediaUrl: 'https://example.com/a.mp4',
    castingwords: {orderId: 'real-order', audioFileId: '123'},
    muxAsset: {muxAssetId: 'mux-1'},
  })
  const res = await post({audiofile: '123', order: 'real-order'})
  expect(res.code).toBe(200)
  expect(mockCreateTrack).not.toHaveBeenCalled()
})
