import {SkillRecordingsHandlerParams} from '../types'
import {OutgoingResponse} from '../index'
import {getSdk, prisma} from '@skillrecordings/database'
import {
  recordNewPurchase,
  stripe,
  NO_ASSOCIATED_PRODUCT,
} from '@skillrecordings/commerce-server'
import {buffer} from 'micro'
import {postSaleToSlack, sendServerEmail} from '../../server'
import {convertkitTagPurchase} from './convertkit'
import {Inngest} from 'inngest'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function processStripeWebhooks({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const {
      req,
      options: {nextAuthOptions},
      rawReq,
    } = params
    if (!rawReq) {
      return {
        status: 500,
        body: `no raw request found for stripe verification, check bodyParser config!`,
      }
    }

    const buf = await buffer(rawReq)
    const sig = req.headers['stripe-signature']

    let event: any
    const {
      updatePurchaseStatusForCharge,
      findOrCreateUser,
      transferPurchasesToNewUser,
    } = getSdk()
    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret)

      if (event.type === 'checkout.session.completed') {
        const {user, purchase, purchaseInfo} = await recordNewPurchase(
          event.data.object.id,
        )

        if (!user) throw new Error('no-user-created')

        const email = user.email as string

        // TODO: Send different email type for upgrades

        if (process.env.INNGEST_EVENT_KEY) {
          const inngest = new Inngest({
            id:
              process.env.INNGEST_APP_NAME ||
              process.env.NEXT_PUBLIC_SITE_TITLE ||
              'Stripe Handler',
            eventKey: process.env.INNGEST_EVENT_KEY,
          })
          console.log('sending inngest event')
          await inngest.send({
            name: STRIPE_CHECKOUT_COMPLETED_EVENT,
            user,
            data: {
              purchaseId: purchase.id,
              quantity: purchaseInfo.quantity,
              productId: purchase.productId,
              created: purchase.createdAt.getTime(),
            },
          })
        }

        if (nextAuthOptions) {
          await sendServerEmail({
            email,
            callbackUrl: `${process.env.NEXT_PUBLIC_URL}/welcome?purchaseId=${purchase.id}`,
            nextAuthOptions,
            type: 'purchase',
          })
        } else {
          console.warn('⛔️ not sending email: no nextAuthOptions found')
        }

        if (process.env.NODE_ENV === 'production') {
          await convertkitTagPurchase(email, purchase)
        }

        await postSaleToSlack(purchaseInfo, purchase)

        return {
          status: 200,
          body: 'success!',
        }
      } else if (event.type === 'charge.refunded') {
        const chargeId = event.data.object.id
        await updatePurchaseStatusForCharge(chargeId, 'Refunded')
        return {
          status: 200,
          body: 'success!',
        }
      } else if (event.type === 'charge.dispute.created') {
        const chargeId = event.data.object.id
        await updatePurchaseStatusForCharge(chargeId, 'Disputed')
        return {
          status: 200,
          body: 'success!',
        }
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

          const {user: updateUser} = await findOrCreateUser(email, name)

          await transferPurchasesToNewUser({
            merchantCustomerId: merchantCustomer.id,
            userId: updateUser.id,
          })

          if (
            currentEmail.toLowerCase() !== email.toLowerCase() &&
            nextAuthOptions
          ) {
            await sendServerEmail({
              email,
              callbackUrl: `${process.env.NEXTAUTH_URL}`,
              nextAuthOptions,
            })
          }
        } else {
          console.log(`no user found for customer ${event.data.object.id}`)
        }

        return {
          status: 200,
          body: 'success!',
        }
      } else {
        return {
          status: 200,
          body: 'not handled',
        }
      }
    } catch (err: any) {
      if (err.message === NO_ASSOCIATED_PRODUCT) {
        console.error(err.message)
        return {
          status: 200,
          body: 'not handled',
        }
      } else {
        console.error(err)
        return {
          status: 400,
          body: `Webhook Error: ${err.message}`,
        }
      }
    }
  } catch (error: any) {
    console.error(error)
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
