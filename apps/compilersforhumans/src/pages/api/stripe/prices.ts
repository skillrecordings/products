import {NextApiRequest, NextApiResponse} from 'next'
import {fetchStripePrice} from '../../../utils/stripe'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    console.error('non-get request made')
    res.status(404).end()
  }

  try {
    const {
      query: {id},
    } = req

    if (typeof id !== 'string' || !id) {
      throw 'id is invalid.'
    }

    const price = await fetchStripePrice(id)
    const unitAmount = price && price.unit_amount
    // we calculate priceInDollars because the sellable_purchase#prices end point sends back dollars
    const priceInDollars = Math.ceil(unitAmount || 0 / 100)

    // we have to send back an array to match sellable_purchases#prices endpoint
    res.status(200).json([
      {
        ...price,
        price: priceInDollars,
        full_price: priceInDollars,
      },
    ])
  } catch (error) {
    console.log(error)
    res.status(200).end()
  }
}

export default handler
