// Used for validating the kit-action get test
import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.json({
    kit: '@johnlindquist/kit',
  })
}
