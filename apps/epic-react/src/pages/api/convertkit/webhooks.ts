import {NextApiRequest, NextApiResponse} from 'next'

import {inngest} from '@/inngest/inngest.server'
import {
  CONVERTKIT_WEBHOOK_EVENT,
  ConvertkitSubscriberWebhookSchema,
} from '@/inngest/functions/create-custom-coupon'

const convertkitWebhooks = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.query.api_key !== process.env.SKILL_CONVERTKIT_SECRET) {
    console.log('convertkit api secret does not match', req.query, req.body)
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    console.log('received:', {body: req.body})
    const {subscriber} = req.body
    await inngest.send({
      name: CONVERTKIT_WEBHOOK_EVENT,
      data: ConvertkitSubscriberWebhookSchema.parse({
        subscriber,
      }),
    })
  } else {
    res.status(200).end()
  }
}

export default convertkitWebhooks
