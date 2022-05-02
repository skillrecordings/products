import {NextApiRequest, NextApiResponse} from 'next'

const pricesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const prices = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/sellable_purchases/prices`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            site: process.env.NEXT_PUBLIC_SITE_NAME,
            sellables: [
              {
                site: 'epic_react',
                sellable_id: 'epic-react-pro-e28f',
                sellable: 'playlist',
                quantity: 1,
              },
              {
                site: 'pro_testing',
                sellable_id: 'pro-testing',
                sellable: 'playlist',
                quantity: 1,
              },
            ],
          }),
        },
      ).then((response) => response.json())
      res.status(200).json(prices)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        res
          .status(500)
          .json({success: false, message: error.message, body: req.body})
      } else {
        res.status(500).json({
          success: false,
          message: 'unknown error occurred',
          body: req.body,
        })
      }
    }
  } else {
    console.error('non-GET request made')
    res.status(404).end()
  }
}

export default pricesHandler
