import type {NextApiRequest, NextApiResponse} from 'next'

const couponRedemtionHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'POST') {
    try {
      res.status(200).json({})
    } catch (error: any) {
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default couponRedemtionHandler
