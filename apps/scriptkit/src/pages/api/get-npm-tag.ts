import {NextApiRequest, NextApiResponse} from 'next'
import '@johnlindquist/kit'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {tag = 'latest'} = req.query
  let url = await kit(`get-npm-tag ${tag}`)

  res.redirect(url)
}
