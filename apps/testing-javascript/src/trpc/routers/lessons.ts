import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {getLessonCodeUrls} from '@/server/lessons.server'
import {z} from 'zod'

export const lessonsRouter = router({
  getLessonCodeUrls: publicProcedure
    .input(z.object({_id: z.string().optional()}))
    .query(async ({input}) => {
      const {_id} = input

      if (!_id)
        return {
          github_branch_url: undefined,
          github_diff_url: undefined,
          codesandbox_url: undefined,
        }

      const codeUrls = await getLessonCodeUrls({_id})

      return codeUrls
    }),
})
