import {first, get, isEmpty} from 'lodash'
import {NextApiRequest, NextApiResponse} from 'next'
import {getDecodedToken} from 'utils/get-decoded-token'
import {progressTable, supabase} from 'utils/progress'

const setProgress = async (req: NextApiRequest, res: NextApiResponse) => {
  const sessionToken = await getDecodedToken(req)

  // set progress
  if (req.method === 'POST') {
    try {
      if (!sessionToken || !sessionToken.sub) {
        return res.status(401).end('Not Authorized')
      }
      if (!supabase) {
        throw new Error('Unable to set progress.')
      }
      const completed = await supabase
        .from(progressTable)
        .select('completed')
        .eq('user_id', sessionToken.sub)

      const allCompletedForUser = get(first(completed.data), 'completed')
      const isCurrentCompleted = allCompletedForUser?.includes(req.query.slug)

      // postgres timestamptz format
      const now = new Date(Date.now()).toISOString()

      if (isCurrentCompleted) {
        // remove current lesson from completed array (toggle complete status)
        const allCompletedWithoutCurrent = allCompletedForUser?.filter(
          (slug: string) => slug !== req.query.slug,
        )
        const {data = [], error} = await supabase
          .from(progressTable)
          .update({
            updated_at: now,
            completed: allCompletedWithoutCurrent,
          })
          .match({user_id: sessionToken.sub})

        if (error) {
          console.error(error)
          throw new Error('Data not loaded')
        }

        const progress = data
        res.status(200).json(progress)
      } else {
        // insert current lesson into completed array
        const {data = [], error} = await supabase.from(progressTable).upsert({
          user_id: sessionToken.sub,
          updated_at: now,
          completed: !isEmpty(allCompletedForUser)
            ? [req.query.slug, ...allCompletedForUser]
            : [req.query.slug],
        })

        if (error) {
          console.error(error)
          throw new Error('Data not loaded')
        }

        const progress = data
        res.status(200).json(progress)
      }
    } catch (error: any) {
      console.error(error.message)
      res.status(400).end(error.message)
    }
  }
}

export default setProgress
