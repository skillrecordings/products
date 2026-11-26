import {prisma} from '@skillrecordings/database'
import {getModuleById} from '@skillrecordings/skill-lesson/lib/modules'
import {getToken} from 'next-auth/jwt'
import handler from '@/pages/api/certificate'
import {certificateRouter} from '@/trpc/routers/certificate'
import {cloudinary} from '@/utils/cloudinary'
import {renderCertificate} from './certificate-handler.server'
import {canEarnCourseCertificate} from './course-certificate.server'
import {
  COURSE_CERTIFICATE_SLUG,
  EPIC_REACT_COURSE_PRODUCT_ID,
} from './course-certificate'

jest.mock('next-auth/jwt', () => ({getToken: jest.fn()}))
jest.mock(
  '@skillrecordings/database',
  () => ({
    prisma: {user: {findUnique: jest.fn()}},
  }),
  {virtual: true},
)
jest.mock('@skillrecordings/skill-lesson/lib/modules', () => ({
  getModuleById: jest.fn(),
}))
jest.mock('@skillrecordings/skill-lesson', () => {
  const trpc = jest.requireActual('@trpc/server').initTRPC.create()
  return {publicProcedure: trpc.procedure, router: trpc.router}
})
jest.mock('@/utils/cloudinary', () => ({
  cloudinary: {uploader: {upload: jest.fn()}, api: {resource: jest.fn()}},
}))
jest.mock('./certificate-handler.server', () => ({
  renderCertificate: jest.fn(),
}))
jest.mock('./course-certificate.server', () => ({
  canEarnCourseCertificate: jest.fn(),
}))

const user = {id: 'test-user', name: 'Michał Test'}
const productId = EPIC_REACT_COURSE_PRODUCT_ID
const png = Buffer.from('test-image-bytes')

beforeEach(() => {
  getToken.mockResolvedValue(user)
  prisma.user.findUnique.mockResolvedValue(user)
  canEarnCourseCertificate.mockResolvedValue(true)
  renderCertificate.mockResolvedValue(png)
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
  expect((await download({productId})).status).toHaveBeenCalledWith(401)
  canEarnCourseCertificate.mockResolvedValueOnce(false)
  expect((await download({productId})).status).toHaveBeenCalledWith(403)
  expect(renderCertificate).not.toHaveBeenCalled()
})

it('renders a private download for the authenticated learner, ignoring query identity', async () => {
  const res = await download({
    productId,
    userId: 'other-user',
    name: 'Test Learner',
  })
  expect(canEarnCourseCertificate).toHaveBeenCalledWith(user.id)
  expect(renderCertificate).toHaveBeenCalledWith(user.name)
  expect(res.setHeader).toHaveBeenCalledWith(
    'Cache-Control',
    'private, no-store',
  )
  expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png')
  expect(res.send).toHaveBeenCalledWith(png)
})

it('handles the workshop route without falling back to a course certificate', async () => {
  const workshop = {title: 'Test Workshop', image: null}
  getModuleById.mockResolvedValueOnce(workshop).mockResolvedValueOnce(null)
  const res = await download({moduleId: 'test-workshop', name: 'Test Learner'})
  expect(res.send).toHaveBeenCalledWith(png)
  expect(renderCertificate).toHaveBeenCalledWith('Test Learner', workshop)
  expect(
    (await download({moduleId: 'missing', name: 'Test Learner'})).status,
  ).toHaveBeenCalledWith(404)
  expect(renderCertificate).toHaveBeenCalledTimes(1)
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
