import {NextApiRequest, NextApiResponse} from 'next'
import '@johnlindquist/globals'

const url = `https://script-kit-installs.johnlindquist.workers.dev/`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const config = {
    headers: {TOKEN: process.env.SCRIPT_KIT_KV_TOKEN as string},
  }
  const response = await post(url, req.body, config)

  res.send(response.data)
}
