import {NextApiRequest, NextApiResponse} from 'next'
import '@johnlindquist/globals'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.redirect(`/data/emoji.json`)
}
