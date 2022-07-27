import {buffer} from 'micro'
import type {NextApiRequest, NextApiResponse} from 'next'
import {stripe} from '../../../utils/stripe'
import {sendServerEmail} from '../../../utils/send-server-email'
import {nextAuthOptions} from '../auth/[...nextauth]'
import {recordNewPurchase} from '../../../utils/record-new-purchase'
import {withSentry} from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../../../utils/honeycomb-tracer'
import {tagPurchaseConvertkit} from '../../../server/tag-purchase-convertkit'
import {updatePurchaseStatusForCharge} from '../../../lib/purchases'
import {postSaleToSlack} from '../../../server/post-to-slack'
import {PurchaseStatus} from '../../../utils/purchase-status'
import {prisma} from '@skillrecordings/database'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

const stripeWebhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  setupHttpTracing({name: stripeWebhookHandler.name, tracer, req, res})
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    let event: any

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret)

      if (event.type === 'checkout.session.completed') {
        const {user, purchase, purchaseInfo} = await recordNewPurchase(
          event.data.object.id,
        )

        if (!user) throw new Error('no-user-created')

        const email = user.email as string

        // TODO: Send different email type for upgrades

        await sendServerEmail({
          email,
          callbackUrl: `${process.env.NEXT_PUBLIC_URL}/welcome?purchaseId=${purchase.id}`,
          nextAuthOptions,
          type: 'purchase',
        })

        await tagPurchaseConvertkit(email)

        await postSaleToSlack(purchaseInfo, purchase)

        res.status(200).send(`This works!`)
      } else if (event.type === 'charge.refunded') {
        const chargeId = event.data.object.id
        await updatePurchaseStatusForCharge(chargeId, PurchaseStatus.Refunded)
        res.status(200).send(`This works!`)
      } else if (event.type === 'charge.dispute.created') {
        const chargeId = event.data.object.id
        await updatePurchaseStatusForCharge(chargeId, PurchaseStatus.Disputed)
        res.status(200).send(`This works!`)
      } else if (event.type === 'customer.updated') {
        const merchantCustomer = await prisma.merchantCustomer.findFirst({
          where: {
            identifier: event.data.object.id,
          },
          include: {
            user: true,
          },
        })

        const user = merchantCustomer?.user

        if (user) {
          const currentEmail = user.email
          const {email, name} = event.data.object
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              email,
              name,
            },
          })

          if (currentEmail.toLowerCase() !== email.toLowerCase()) {
            await sendServerEmail({
              email,
              callbackUrl: `${process.env.NEXTAUTH_URL}/learn`,
              nextAuthOptions,
            })
          }
        } else {
          console.log(`no user found for customer ${event.data.object.id}`)
        }

        res.status(200).send(`This works!`)
      } else {
        res.status(200).send(`not-handled`)
      }
    } catch (err: any) {
      Sentry.captureException(err)
      console.error(err)
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default withSentry(stripeWebhookHandler)

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}
