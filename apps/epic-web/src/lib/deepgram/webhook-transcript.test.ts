// sec-166: the Deepgram webhook writes a transcript only for a callback URL we
// signed when ordering. Anyone else who knows a videoResource _id is refused.
const mockFetchResource = jest.fn()
const mockPatchCommit = jest.fn()
const mockSend = jest.fn()
jest.mock('@skillrecordings/skill-lesson/utils/sanity-server', () => ({
  sanityWriteClient: {
    fetch: (...args: unknown[]) => mockFetchResource(...args),
    patch: () => ({set: () => ({commit: mockPatchCommit})}),
  },
}))
jest.mock(
  'inngest/inngest.server',
  () => ({
    inngest: {send: (...args: unknown[]) => mockSend(...args)},
  }),
  {
    virtual: true,
  },
)
// Under jest the `inngest` package shadows the src/inngest alias, so these
// app modules are mocked by name. Event names match src/inngest/events.ts.
jest.mock(
  'inngest/events',
  () => ({
    VIDEO_TRANSCRIPT_READY_EVENT: 'video/transcript.ready',
    VIDEO_SRT_READY_EVENT: 'video/srt.ready',
    TIP_VIDEO_SRT_READY_EVENT: 'tip/video.srt.ready',
    TIP_VIDEO_TRANSCRIPT_CREATED_EVENT: 'tip/video.transcript.created',
  }),
  {virtual: true},
)
jest.mock('@sentry/nextjs', () => ({captureException: jest.fn()}))
jest.mock('lib/deepgram', () => ({
  processDeepgramResults: () => ({
    text: 'hello',
    srt: '1\n00:00 --> 00:01\nhello',
  }),
}))
jest.mock('lib/deepgram/types', () => ({
  DeepgramCallbackSchema: {
    safeParse: (data: unknown) => ({success: true, data}),
  },
}))

import handler from 'pages/api/webhooks/deepgram/transcript'
import {deepgramCallbackParams} from 'lib/deepgram/callback-signature'

const saved = {...process.env}
beforeEach(() => {
  jest.clearAllMocks()
  process.env = {...saved, NEXTAUTH_SECRET: 'test-callback-secret'} as never
  mockFetchResource.mockResolvedValue({
    _id: 'vr-1',
    transcript: null,
    muxAsset: {muxAssetId: 'mux-1'},
  })
  jest.spyOn(console, 'info').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterAll(() => {
  process.env = saved
})

async function call(query: Record<string, string | undefined>) {
  const res: any = {code: 0, body: undefined}
  res.status = (code: number) => {
    res.code = code
    return res
  }
  res.json = (body: unknown) => {
    res.body = body
    return res
  }
  await handler(
    {method: 'POST', query, body: {results: {}}} as never,
    res as never,
  )
  return res
}

const signed = (id: string, secret = 'test-callback-secret') => ({
  videoResourceId: id,
  ...deepgramCallbackParams(secret, id),
})

test('refuses a callback with no signature and writes nothing', async () => {
  const res = await call({videoResourceId: 'vr-1'})
  expect(res.code).toBe(401)
  expect(mockPatchCommit).not.toHaveBeenCalled()
  expect(mockSend).not.toHaveBeenCalled()
})

test.each([
  [
    'signed for another resource',
    () => ({...signed('vr-2'), videoResourceId: 'vr-1'}),
  ],
  ['signed with another secret', () => signed('vr-1', 'not-our-secret')],
  [
    'expired',
    () => {
      const now = Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60
      return {
        videoResourceId: 'vr-1',
        ...deepgramCallbackParams('test-callback-secret', 'vr-1', now),
      }
    },
  ],
  ['a malformed signature', () => ({...signed('vr-1'), sig: 'abc'})],
])('refuses a callback %s', async (_label, query) => {
  const res = await call(query())
  expect(res.code).toBe(401)
  expect(mockPatchCommit).not.toHaveBeenCalled()
})

test('refuses everything when the secret is not configured', async () => {
  const query = signed('vr-1')
  process.env = {...process.env, NEXTAUTH_SECRET: undefined} as never
  expect((await call(query)).code).toBe(401)
})

test('accepts a callback we signed, writes the transcript and emits the tip event', async () => {
  const res = await call(signed('vr-1'))
  expect(res.code).toBe(200)
  expect(mockPatchCommit).toHaveBeenCalledTimes(1)
  const names = mockSend.mock.calls[0][0].map((e: {name: string}) => e.name)
  expect(names).toContain('tip/video.transcript.created')
})
