import Stripe from 'stripe'
import {buffer} from 'micro'
import type {NextApiRequest, NextApiResponse} from 'next'

const stripe = new Stripe(process.env.STRIPE_SECRET_TOKEN, {
  apiVersion: '2020-08-27',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    let event

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret)

      if (event.type === 'charge.succeeded') {
        const charge = event.data.object
        // Handle successful charge

        console.log({charge})

        res.status(200).send(`This works!`)
      } else {
        console.warn(`Unhandled event type: ${event.type}`)
      }
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default handler

export const config = {
  api: {
    bodyParser: false,
  },
}
