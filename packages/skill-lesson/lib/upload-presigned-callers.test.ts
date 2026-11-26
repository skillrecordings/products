// sec-165: Mux gets a presigned GET for an upload, signed at the call, and the
// value returned to callers (who store it) holds none. CastingWords is retired:
// the video-created webhook orders nothing and writes only the Mux asset.
const assetsCreate = jest.fn()
jest.mock('@mux/mux-node', () =>
  jest
    .fn()
    .mockImplementation(() => ({Video: {Assets: {create: assetsCreate}}})),
)
const mockSet = jest.fn()
const mockCommit = jest.fn()
const mockPatch = jest.fn()
const mockFetchDoc = jest.fn()
jest.mock('../utils/sanity-server', () => ({
  sanityWriteClient: {
    patch: (...args: unknown[]) => mockPatch(...args),
    fetch: (...args: unknown[]) => mockFetchDoc(...args),
  },
}))
jest.mock('@sanity/webhook', () => ({
  SIGNATURE_HEADER_NAME: 'sanity-webhook-signature',
  isValidSignature: jest.fn(async () => true),
}))

import {createMuxAsset} from './mux'
import {sanityVideoResourceWebhook} from './sanity'

const objectUrl =
  'https://uploads-bucket.s3.us-east-1.amazonaws.com/partner-uploads/1b2c/clip.mp4'
const SIGNED = /X-Amz-Signature=[0-9a-f]{64}/
const saved = {...process.env}
const fetchMock = jest.fn()

beforeEach(() => {
  assetsCreate.mockReset()
  mockSet.mockReset().mockReturnValue({commit: mockCommit})
  mockCommit.mockReset().mockResolvedValue({})
  mockPatch.mockReset().mockReturnValue({set: mockSet})
  mockFetchDoc.mockReset().mockResolvedValue(null)
  // Answers like a CastingWords order would, so any code path that still
  // orders a transcript gets far enough to show up in these tests.
  fetchMock.mockReset().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({audiofiles: [7], order: 'o-1'}),
    text: async () => '',
  })
  global.fetch = fetchMock as never
  // The jest 27 node environment this package runs in exposes no Headers.
  ;(global as any).Headers ??= class {
    append() {}
  }
  process.env = {
    ...saved,
    AWS_VIDEO_UPLOAD_BUCKET: 'uploads-bucket',
    AWS_VIDEO_UPLOAD_REGION: 'us-east-1',
    AWS_VIDEO_UPLOAD_ACCESS_KEY_ID: 'test-access-key-id',
    AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY: 'example-secret-not-real',
    // Still set on the live sites until the key is revoked; a leftover
    // ordering path must not find it missing and bail out silently.
    CASTINGWORDS_API_TOKEN: 'cw-token-not-real',
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

function webhookResponse() {
  const res: any = {}
  res.status = jest.fn(() => res)
  res.json = jest.fn(() => res)
  return res
}

describe('sanityVideoResourceWebhook (CastingWords retired)', () => {
  test('a new resource gets a Mux asset and a patch with no transcript order', async () => {
    assetsCreate.mockResolvedValue({
      id: 'mux-2',
      duration: 30,
      playback_ids: [{policy: 'public', id: 'pb-2'}],
    })
    const res = webhookResponse()
    await sanityVideoResourceWebhook(
      {
        headers: {'sanity-webhook-signature': 'sig'},
        body: {_id: 'vr-1', originalMediaUrl: objectUrl},
      } as any,
      res,
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(assetsCreate).toHaveBeenCalledTimes(1)
    expect(mockPatch).toHaveBeenCalledWith('vr-1')
    expect(mockSet).toHaveBeenCalledWith({
      duration: 30,
      muxAsset: {muxAssetId: 'mux-2', muxPlaybackId: 'pb-2'},
    })
    // No transcription service is called: CastingWords is gone.
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('a resend of the creation body writes nothing when the stored resource has a Mux asset', async () => {
    // Sanity's resend carries the original creation body: no muxAsset in it.
    mockFetchDoc.mockResolvedValue({
      muxAsset: {muxAssetId: 'mux-old', muxPlaybackId: 'pb-old'},
    })
    const res = webhookResponse()
    await sanityVideoResourceWebhook(
      {
        headers: {'sanity-webhook-signature': 'sig'},
        body: {_id: 'vr-old', originalMediaUrl: objectUrl},
      } as any,
      res,
    )
    expect(mockFetchDoc).toHaveBeenCalledWith(expect.any(String), {
      id: 'vr-old',
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(assetsCreate).not.toHaveBeenCalled()
    expect(mockPatch).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('a replayed delivery for a resource that has a Mux asset writes nothing', async () => {
    const res = webhookResponse()
    await sanityVideoResourceWebhook(
      {
        headers: {'sanity-webhook-signature': 'sig'},
        body: {
          _id: 'vr-old',
          originalMediaUrl: objectUrl,
          muxAsset: {muxAssetId: 'mux-old', muxPlaybackId: 'pb-old'},
        },
      } as any,
      res,
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(assetsCreate).not.toHaveBeenCalled()
    expect(mockPatch).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
