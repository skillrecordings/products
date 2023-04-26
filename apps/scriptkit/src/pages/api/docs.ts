import {NextApiRequest, NextApiResponse} from 'next'
import '@johnlindquist/globals'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.redirect(
    `https://github.com/johnlindquist/kit-docs/releases/latest/download/docs.json`,
  )
}
