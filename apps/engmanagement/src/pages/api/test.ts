import {NextApiRequest, NextApiResponse} from 'next'

const test = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({data: 'hi'})
}

export default test
