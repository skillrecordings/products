import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getToken} from 'next-auth/jwt'
import {cloudinary} from '@/utils/cloudinary'
import {TRPCError} from '@trpc/server'
import {COURSE_CERTIFICATE_SLUG} from '@/certificate/course-certificate'
import {canEarnCourseCertificate} from '@/certificate/course-certificate.server'

const certificateSlug = z
  .string()
  .regex(/^[a-zA-Z0-9_-]+$/)
  .refine(
    (slug) =>
      slug.toLowerCase() !== COURSE_CERTIFICATE_SLUG ||
      slug === COURSE_CERTIFICATE_SLUG,
    {message: 'Use the canonical course certificate slug'},
  )

export const certificateRouter = router({
  upload: publicProcedure
    .input(
      z.object({
        imagePath: z.string(),
        moduleSlug: certificateSlug.refine(
          (slug) => slug !== COURSE_CERTIFICATE_SLUG,
          {message: 'Use the course certificate endpoint'},
        ),
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

      return await uploadImage(input.imagePath, user.id, input.moduleSlug)
    }),
  get: publicProcedure
    .input(
      z.object({moduleSlug: certificateSlug, imagePath: z.string().optional()}),
    )
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
        if (
          input.moduleSlug === COURSE_CERTIFICATE_SLUG &&
          error?.error?.http_code === 404
        )
          return null
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
