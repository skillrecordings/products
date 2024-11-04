import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getToken} from 'next-auth/jwt'
import {cloudinary} from '@/utils/cloudinary'

export const certificateRouter = router({
  upload: publicProcedure
    .input(
      z.object({
        imagePath: z.string(),
        moduleSlug: z.string(),
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
      z.object({
        imagePath: z.string(),
        moduleSlug: z.string(),
      }),
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

      const cert = await cloudinary.api.resource(
        `certificate/${user.id}/${input.moduleSlug}`,
      )
      return cert
    }),
})

// UTILS

const uploadImage = async (
  imagePath: string,
  userId: string,
  moduleSlug: string,
) => {
  const options = {
    public_id: `certificate/${userId}/${moduleSlug}`,
    unique_filename: true,
    use_filename: true,
    overwrite: true,
    filename_override: true,
  }

  try {
    const result = await cloudinary.uploader.upload(imagePath, options)
    return result
  } catch (error) {
    console.error(error)
  }
}
