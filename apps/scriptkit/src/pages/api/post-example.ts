import {NextApiRequest, NextApiResponse} from 'next'
import '@johnlindquist/globals'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let {body} = req
  res.json({
    message: `You posted it, ${body.name}!`,
  })
}
