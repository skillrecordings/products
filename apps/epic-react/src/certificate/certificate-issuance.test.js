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

function download(query) {
  const res = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    end: jest.fn(),
    send: jest.fn(),
  }
  return handler({method: 'GET', query}, res).then(() => res)
}

it('rejects anonymous and incomplete course downloads before rendering', async () => {
  getToken.mockResolvedValueOnce(null)
  expect((await download({})).status).toHaveBeenCalledWith(401)
  canEarnCourseCertificate.mockResolvedValueOnce(false)
  expect((await download({})).status).toHaveBeenCalledWith(403)
  expect(renderCourseCertificate).not.toHaveBeenCalled()
})

it('renders a private download for the authenticated learner, ignoring query identity', async () => {
  const res = await download({
    userId: 'other-user',
    name: 'Test Learner',
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

it('shares only server-rendered bytes for eligible learners in the reserved course slot', async () => {
  const caller = certificateRouter.createCaller({req: {}, prisma})
  const input = {
    moduleSlug: COURSE_CERTIFICATE_SLUG,
    imagePath: 'https://example.com/not-a-certificate.png',
  }
  canEarnCourseCertificate.mockResolvedValueOnce(false)
  await expect(caller.upload(input)).rejects.toMatchObject({code: 'FORBIDDEN'})
  expect(cloudinary.uploader.upload).not.toHaveBeenCalled()

  cloudinary.uploader.upload.mockResolvedValue({
    secure_url: 'https://example.com/certificate.png',
  })
  await caller.upload(input)
  expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
    `data:image/png;base64,${png.toString('base64')}`,
    expect.objectContaining({
      public_id: 'certificate/test-user/epic-react-pro',
    }),
  )
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
