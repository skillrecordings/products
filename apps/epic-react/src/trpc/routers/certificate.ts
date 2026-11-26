import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getToken} from 'next-auth/jwt'
import {cloudinary} from '@/utils/cloudinary'
import {TRPCError} from '@trpc/server'
import {COURSE_CERTIFICATE_SLUG} from '@/certificate/course-certificate'
import {canEarnCourseCertificate} from '@/certificate/course-certificate.server'
import {renderCertificate} from '@/certificate/certificate-handler.server'

const certificateSlug = z.string().regex(/^[a-zA-Z0-9_-]+$/)

export const certificateRouter = router({
  upload: publicProcedure
    .input(
      z.object({
        imagePath: z.string().optional(),
        moduleSlug: certificateSlug,
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})

      if (!token) return null

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: token.id as string,
        },
        include: {
          accounts: true,
        },
      })

      if (!user) return null

      if (input.moduleSlug === COURSE_CERTIFICATE_SLUG) {
        if (!(await canEarnCourseCertificate(user.id))) {
          throw new TRPCError({code: 'FORBIDDEN'})
        }
        if (!user.name?.trim()) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Please save your name first',
          })
        }

        // Cloudinary cannot fetch the authenticated download URL. Upload
        // server-rendered bytes, never the URL supplied by the client.
        const image = await renderCertificate(user.name)
        return await cloudinary.uploader.upload(
          `data:image/png;base64,${image.toString('base64')}`,
          uploadOptions(user.id, COURSE_CERTIFICATE_SLUG),
        )
      }
      if (!input.imagePath) throw new TRPCError({code: 'BAD_REQUEST'})
      return await uploadImage(input.imagePath, user.id, input.moduleSlug)
    }),
  get: publicProcedure
    .input(z.object({moduleSlug: certificateSlug}))
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})

      if (!token) return null

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: token.id as string,
        },
        include: {
          accounts: true,
        },
      })

      if (!user) return null

      if (
        input.moduleSlug === COURSE_CERTIFICATE_SLUG &&
        !(await canEarnCourseCertificate(user.id))
      ) {
        throw new TRPCError({code: 'FORBIDDEN'})
      }

      try {
        return await cloudinary.api.resource(
          `certificate/${user.id}/${input.moduleSlug}`,
        )
      } catch (error: any) {
        if (error?.error?.http_code === 404) return null
        throw error
      }
    }),
})

// UTILS

const uploadOptions = (userId: string, moduleSlug: string) => ({
  public_id: `certificate/${userId}/${moduleSlug}`,
  unique_filename: true,
  use_filename: true,
  overwrite: true,
  filename_override: true,
})

const uploadImage = async (
  imagePath: string,
  userId: string,
  moduleSlug: string,
) => {
  try {
    const result = await cloudinary.uploader.upload(
      imagePath,
      uploadOptions(userId, moduleSlug),
    )
    return result
  } catch (error) {
    console.error(error)
  }
}
