import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {getSdk} from '@skillrecordings/database'
import {
  defaultContext as defaultStripeContext,
  Stripe,
} from '@skillrecordings/stripe-sdk'

const {stripe: defaultStripe} = defaultStripeContext

export async function stripeRefund({
  params,
  paymentOptions,
}: {
  params: SkillRecordingsHandlerParams
  paymentOptions: {stripeCtx: {stripe: Stripe}} | undefined
}): Promise<OutgoingResponse> {
  try {
    const {req} = params
    const skillSecret = req.headers['x-skill-secret'] as string
    const {updatePurchaseStatusForCharge} = getSdk()

    if (skillSecret !== process.env.SKILL_SECRET) {
      return {
        status: 401,
        body: {
          error: 'Unauthorized',
        },
      }
    }

    const stripe = paymentOptions?.stripeCtx.stripe || defaultStripe

    if (!stripe) {
      throw new Error('Stripe client is missing')
    }

    const stripeChargeId =
      (req.query?.stripeChargeId as string) ||
      (req.body?.stripeChargeId as string)

    if (!stripeChargeId) {
      return {
        status: 400,
        body: {
          error: true,
          message: 'Missing required parameter: stripeChargeId',
        },
      }
    }

    const processRefund = await stripe.refunds.create({
      charge: stripeChargeId,
    })

    const updateResult = await updatePurchaseStatusForCharge(
      stripeChargeId,
      'Refunded',
    )

    if (!updateResult) {
      throw new Error('Failed to update purchase status')
    }

    return {
      status: 200,
      body: processRefund,
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
