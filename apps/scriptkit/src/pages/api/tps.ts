// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiRequest, NextApiResponse} from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200
  res.json({
    response: `Thanks for filing out our form ${req.body.name}!`,
    email: req.body.email,
  })
}
