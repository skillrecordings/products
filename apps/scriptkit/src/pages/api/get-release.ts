import {NextApiRequest, NextApiResponse} from 'next'
import '@johnlindquist/kit'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {channel = 'main'} = req.query

  let url = await kit(`get-kit-release ${channel}`)

  res.redirect(url)
}
