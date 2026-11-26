import {createDeepgramProvider} from './provider'

// sec-165: Deepgram gets a presigned GET for an upload, signed at the call,
// and neither its reply nor an error carries the signed URL back.
const objectUrl =
  'https://uploads-bucket.s3.us-east-1.amazonaws.com/partner-uploads/1b2c/clip.mp4'
const SIGNED = /X-Amz-Signature=[0-9a-f]{64}/
const saved = {...process.env}

beforeEach(() => {
  process.env = {
    ...saved,
    AWS_VIDEO_UPLOAD_BUCKET: 'uploads-bucket',
    AWS_VIDEO_UPLOAD_REGION: 'us-east-1',
    AWS_VIDEO_UPLOAD_ACCESS_KEY_ID: 'test-access-key-id',
    AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY: 'example-secret-not-real',
  } as unknown as NodeJS.ProcessEnv
})

afterAll(() => {
  process.env = saved
})

const provider = createDeepgramProvider({
  apiKey: 'dg-key',
  callbackBaseUrl: 'https://www.epicweb.dev',
})

function mockFetch(
  reply: (body: {url: string}) => {ok: boolean; body: unknown},
) {
  const fetchMock = jest.fn(async (_url: string, init: {body: string}) => {
    const {ok, body} = reply(JSON.parse(init.body))
    return {
      ok,
      status: ok ? 200 : 400,
      json: async () => body,
      text: async () =>
        typeof body === 'string' ? body : JSON.stringify(body),
    }
  })
  global.fetch = fetchMock as never
  return fetchMock
}

test('hands Deepgram a presigned GET for the upload', async () => {
  const fetchMock = mockFetch(() => ({ok: true, body: {request_id: 'req-1'}}))
  const result = await provider.initiateTranscription({
    mediaUrl: objectUrl,
    videoResourceId: 'vr-1',
  })
  const sent = JSON.parse(fetchMock.mock.calls[0][1].body).url as string
  expect(sent.startsWith(`${objectUrl}?`)).toBe(true)
  expect(sent).toMatch(SIGNED)
  expect(result).toEqual({request_id: 'req-1'})
})

test('keeps no signed URL when Deepgram echoes it back', async () => {
  mockFetch(({url}) => ({
    ok: true,
    body: {request_id: 'req-1', metadata: {url}},
  }))
  const result = await provider.initiateTranscription({
    mediaUrl: objectUrl,
    videoResourceId: 'vr-1',
  })
  expect(JSON.stringify(result)).not.toMatch(/X-Amz-Signature/)
})

test('keeps no signed URL in a Deepgram error', async () => {
  mockFetch(({url}) => ({ok: false, body: `could not fetch ${url}`}))
  const error = await provider
    .initiateTranscription({mediaUrl: objectUrl, videoResourceId: 'vr-1'})
    .catch((e: Error) => e)
  expect((error as Error).message).toContain(objectUrl)
  expect((error as Error).message).not.toMatch(/X-Amz-Signature/)
})
