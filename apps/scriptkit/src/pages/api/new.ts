// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiRequest, NextApiResponse} from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200
  const {name, url} = req.query
  res.redirect(`kit:new?name=${name}&url=${url}`)
}
