import {NextApiRequest, NextApiResponse} from 'next'
import '@johnlindquist/globals'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.json({
    message: 'You got it!',
  })
}
