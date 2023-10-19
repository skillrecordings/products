import {NextApiRequest, NextApiResponse} from 'next'

export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/inngest`, {
      method: 'PUT',
    })
    response.status(200).end()
  } catch (error) {
    console.error('failed to deploy inngest', error)
  }
}
