// sec-165: Mux and CastingWords get a presigned GET for an upload, signed at
// the call, and the value returned to callers (who store it) holds none.
const assetsCreate = jest.fn()
jest.mock('@mux/mux-node', () =>
  jest
    .fn()
    .mockImplementation(() => ({Video: {Assets: {create: assetsCreate}}})),
)
jest.mock('./sanity', () => ({writeTranscriptToVideoResource: jest.fn()}))

import {createMuxAsset} from './mux'
import {orderTranscript} from './castingwords'

const objectUrl =
  'https://uploads-bucket.s3.us-east-1.amazonaws.com/partner-uploads/1b2c/clip.mp4'
const SIGNED = /X-Amz-Signature=[0-9a-f]{64}/
const saved = {...process.env}

beforeEach(() => {
  assetsCreate.mockReset()
  process.env = {
    ...saved,
    AWS_VIDEO_UPLOAD_BUCKET: 'uploads-bucket',
    AWS_VIDEO_UPLOAD_REGION: 'us-east-1',
    AWS_VIDEO_UPLOAD_ACCESS_KEY_ID: 'test-access-key-id',
    AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY: 'example-secret-not-real',
    CASTINGWORDS_API_TOKEN: 'cw-token',
  }
})

afterAll(() => {
  process.env = saved
})

describe('createMuxAsset', () => {
  test('hands Mux a presigned GET and returns no URL', async () => {
    assetsCreate.mockResolvedValue({
      id: 'mux-1',
      duration: 12,
      playback_ids: [{policy: 'public', id: 'pb-1'}],
    })
    const result = await createMuxAsset({
      originalMediaUrl: objectUrl,
      muxAsset: undefined as never,
      duration: 0,
    })
    const {input} = assetsCreate.mock.calls[0][0]
    expect(input.startsWith(`${objectUrl}?`)).toBe(true)
    expect(input).toMatch(SIGNED)
    expect(result).toEqual({
      duration: 12,
      muxAssetId: 'mux-1',
      muxPlaybackId: 'pb-1',
    })
  })

  test('keeps no signed URL in a Mux error', async () => {
    assetsCreate.mockImplementation(async ({input}: {input: string}) => {
      throw new Error(`input ${input} could not be downloaded`)
    })
    const error = await createMuxAsset({
      originalMediaUrl: objectUrl,
      muxAsset: undefined as never,
      duration: 0,
    }).catch((e: Error) => e)
    expect((error as Error).message).toContain(objectUrl)
    expect((error as Error).message).not.toMatch(/X-Amz-Signature/)
  })

  test('does not sign when the asset already exists', async () => {
    const existing = {muxAssetId: 'mux-0', muxPlaybackId: 'pb-0'}
    await createMuxAsset({
      originalMediaUrl: objectUrl,
      muxAsset: existing,
      duration: 3,
    })
    expect(assetsCreate).not.toHaveBeenCalled()
  })
})

describe('CastingWords orderTranscript', () => {
  test('orders with a presigned GET valid for a day', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: async () => ({audiofiles: [7], order: 'o-1'}),
    })
    global.fetch = fetchMock as never
    // The jest 27 node environment this package runs in exposes no Headers.
    ;(global as any).Headers ??= class {
      append() {}
    }
    const order = await orderTranscript(objectUrl)
    const orderUrl = new URL(fetchMock.mock.calls[0][0])
    const media = orderUrl.searchParams.get('url')!
    expect(media.startsWith(`${objectUrl}?`)).toBe(true)
    expect(media).toMatch(SIGNED)
    expect(new URL(media).searchParams.get('X-Amz-Expires')).toBe('86400')
    expect(order).toEqual({audiofiles: [7], order: 'o-1'})
  })
})
