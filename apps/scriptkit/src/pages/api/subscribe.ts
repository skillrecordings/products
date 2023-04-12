import {NextApiRequest, NextApiResponse} from 'next'
import '@johnlindquist/globals'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {email} = req.body

  const response = await post(
    `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
    {
      api_key: process.env.CONVERTKIT_API_KEY as string,
      email,
    },
  )

  res.send(response.data)
}
