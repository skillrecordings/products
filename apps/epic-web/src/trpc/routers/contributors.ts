import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {getAllContributors} from 'lib/contributors'

export const contributorsRouter = router({
  all: publicProcedure.query(async () => {
    return await getAllContributors()
  }),
})
