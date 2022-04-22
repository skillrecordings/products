import {NextApiRequest, NextApiResponse} from 'next'
import {getDecodedToken} from 'utils/get-decoded-token'
import {progressTable, supabase} from 'utils/progress'

const getProgress = async (req: NextApiRequest, res: NextApiResponse) => {
  const sessionToken = await getDecodedToken(req)

  if (req.method === 'GET') {
    try {
      if (!sessionToken || !sessionToken.sub) {
        return res.status(401).end('Not Authorized')
      }
      if (!supabase) {
        throw new Error('Unable to set progress.')
      }
      const {data = [], error} = await supabase
        .from(progressTable)
        .select('completed')
        .eq('user_id', sessionToken.sub)

      if (error) {
        console.error(error)
        throw new Error('Data not loaded')
      }

      const progress = data
      res.status(200).json(progress)
    } catch (error: any) {
      console.error(error.message)
      res.status(400).end(error.message)
    }
  }
}

export default getProgress
