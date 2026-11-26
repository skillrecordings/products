import {prisma} from '@skillrecordings/database'
import {getToken} from 'next-auth/jwt'
import handler from '@/pages/api/course-certificate'
import {certificateRouter} from '@/trpc/routers/certificate'
import {cloudinary} from '@/utils/cloudinary'
import {renderCourseCertificate} from './render-course-certificate.server'
import {canEarnCourseCertificate} from './course-certificate.server'
import {COURSE_CERTIFICATE_SLUG} from './course-certificate'

jest.mock('next-auth/jwt', () => ({getToken: jest.fn()}))
jest.mock(
  '@skillrecordings/database',
  () => ({
    prisma: {user: {findUnique: jest.fn()}},
  }),
  {virtual: true},
)
jest.mock('@skillrecordings/skill-lesson', () => {
  const trpc = jest.requireActual('@trpc/server').initTRPC.create()
  return {publicProcedure: trpc.procedure, router: trpc.router}
})
jest.mock('@/utils/cloudinary', () => ({
  cloudinary: {uploader: {upload: jest.fn()}, api: {resource: jest.fn()}},
}))
jest.mock('./render-course-certificate.server', () => ({
  renderCourseCertificate: jest.fn(),
}))
jest.mock('./course-certificate.server', () => ({
  canEarnCourseCertificate: jest.fn(),
}))

const user = {id: 'test-user', name: 'Michał Test'}
const png = Buffer.from('test-image-bytes')

beforeEach(() => {
  getToken.mockResolvedValue(user)
  prisma.user.findUnique.mockResolvedValue(user)
  canEarnCourseCertificate.mockResolvedValue(true)
  renderCourseCertificate.mockResolvedValue(png)
})

function request(method, fields = {}) {
  const res = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    end: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
  }
  return handler(
    {method, headers: {'content-type': 'application/json'}, ...fields},
    res,
  ).then(() => res)
}

it.each(['GET', 'POST'])(
  'rejects anonymous and incomplete course requests (%s)',
  async (method) => {
    getToken.mockResolvedValueOnce(null)
    expect((await request(method)).status).toHaveBeenCalledWith(401)
    canEarnCourseCertificate.mockResolvedValueOnce(false)
    expect((await request(method)).status).toHaveBeenCalledWith(403)
    expect(renderCourseCertificate).not.toHaveBeenCalled()
    expect(cloudinary.uploader.upload).not.toHaveBeenCalled()
  },
)

it('renders a private download for the authenticated learner, ignoring query identity', async () => {
  const res = await request('GET', {
    query: {userId: 'other-user', name: 'Test Learner'},
  })
  expect(canEarnCourseCertificate).toHaveBeenCalledWith(user.id)
  expect(renderCourseCertificate).toHaveBeenCalledWith(user.name)
  expect(res.setHeader).toHaveBeenCalledWith(
    'Cache-Control',
    'private, no-store',
  )
  expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png')
  expect(res.send).toHaveBeenCalledWith(png)
})

it('shares only server-rendered bytes from the course endpoint', async () => {
  const result = {secure_url: 'https://example.com/certificate.png'}
  cloudinary.uploader.upload.mockResolvedValue(result)
  const res = await request('POST', {
    body: {
      name: 'Test Learner',
      imagePath: 'https://example.com/not-a-certificate.png',
    },
  })
  expect(renderCourseCertificate).toHaveBeenCalledWith(user.name)
  expect(res.json).toHaveBeenCalledWith(result)
  expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
    `data:image/png;base64,${png.toString('base64')}`,
    expect.objectContaining({
      public_id: 'certificate/test-user/epic-react-pro',
    }),
  )
})

it('refuses cross-origin form-compatible uploads before rendering', async () => {
  const res = await request('POST', {
    headers: {'content-type': 'application/x-www-form-urlencoded'},
  })
  expect(res.status).toHaveBeenCalledWith(415)
  expect(renderCourseCertificate).not.toHaveBeenCalled()
})

it('reserves the canonical course slot from tRPC writes but allows authenticated lookups', async () => {
  const caller = certificateRouter.createCaller({req: {}, prisma})
  const input = {
    moduleSlug: COURSE_CERTIFICATE_SLUG,
    imagePath: 'https://example.com/test.png',
  }
  await expect(caller.upload(input)).rejects.toMatchObject({
    code: 'BAD_REQUEST',
  })
  canEarnCourseCertificate.mockResolvedValueOnce(false)
  await expect(caller.get(input)).rejects.toMatchObject({code: 'FORBIDDEN'})
  expect(cloudinary.api.resource).not.toHaveBeenCalled()
  await caller.get(input)
  expect(cloudinary.api.resource).toHaveBeenCalledWith(
    'certificate/test-user/epic-react-pro',
  )
  expect(cloudinary.uploader.upload).not.toHaveBeenCalled()
})

it('rejects mixed-case course slugs before upload or lookup', async () => {
  const caller = certificateRouter.createCaller({req: {}, prisma})
  const input = {
    moduleSlug: 'Epic-React-Pro',
    imagePath: 'https://example.com/test.png',
  }
  await expect(caller.upload(input)).rejects.toMatchObject({
    code: 'BAD_REQUEST',
  })
  await expect(caller.get(input)).rejects.toMatchObject({code: 'BAD_REQUEST'})
  expect(renderCourseCertificate).not.toHaveBeenCalled()
  expect(cloudinary.uploader.upload).not.toHaveBeenCalled()
  expect(cloudinary.api.resource).not.toHaveBeenCalled()
})
