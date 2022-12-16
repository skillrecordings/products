import {SkillRecordingsHandlerParams} from '../types'
import {OutgoingResponse} from '../index'
import {getSdk, prisma} from '@skillrecordings/database'
import {recordNewPurchase, stripe} from '@skillrecordings/commerce-server'
import {buffer} from 'micro'
import {postSaleToSlack, sendServerEmail} from '../../server'
import {convertkitTagPurchase} from './convertkit'

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
    const {updatePurchaseStatusForCharge} = getSdk()
    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret)

      if (event.type === 'checkout.session.completed') {
        const {user, purchase, purchaseInfo} = await recordNewPurchase(
          event.data.object.id,
        )

        if (!user) throw new Error('no-user-created')

        const email = user.email as string

        // TODO: Send different email type for upgrades

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

        await convertkitTagPurchase(email)
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
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              email,
              name,
            },
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
      console.error(err)
      return {
        status: 400,
        body: `Webhook Error: ${err.message}`,
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
