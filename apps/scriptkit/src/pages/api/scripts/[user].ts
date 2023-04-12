// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiRequest, NextApiResponse} from 'next'
import {getScriptsByUser} from 'lib/get-user-scripts'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200
  const {user} = req.query

  const scripts = await getScriptsByUser(user as string)

  res.send(scripts)
}
