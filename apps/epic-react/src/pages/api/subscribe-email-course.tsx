import type {NextApiRequest, NextApiResponse} from 'next'
import {NextResponse} from 'next/server'
import axios from 'axios'

const ckFormId = process.env.NEXT_PUBLIC_CONVERTKIT_REACT_SIGNUP_FORM
const ckAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CONVERTKIT_BASE_URL,
})
type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === 'POST') {
    const {first_name, email_address} = req.body
    let response = NextResponse.next()

    try {
      const subscription = await ckAxios
        .post(`/forms/${ckFormId}/subscribe`, {
          api_key: process.env.NEXT_CONVERTKIT_TOKEN,
          email: email_address,
          first_name,
        })
        .then(({data}) => data.subscription)

      const hour = 3600000
      const oneYear = 365 * 24 * hour
      response.cookies.set('ck_subscriber_id', subscription.subscriber.id, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: oneYear,
      })
      res.status(200).json({message: `subscribed to newsletter`})
    } catch (e: any) {
      res.status(500).json({message: e.message})
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
