import {
  convertkitAnswerQuizQuestion,
  convertkitLoadSubscriber,
  subscribeToConvertkit,
} from './core/services/convertkit'
import {signs3UploadUrl} from './core/services/aws'
import {sendFeedbackFromUser} from './core/services/send-feedback-from-user'
import {redeemGoldenTicket} from './core/services/redeem-golden-ticket'
import {stripeCheckout} from './core/services/stripe-checkout'
import {
  receiveStripeWebhooks,
  receiveInternalStripeWebhooks,
} from './core/services/process-stripe-webhook'
import {lookupUser} from './core/services/lookup-user'
import {IncomingRequest} from './core'
import {claimedSeats} from './core/services/claimed-seats'
import {updateName} from './core/services/update-name'
import {transferPurchase} from './core/services/transfer-purchase'
import {stripeRefund} from './core/services/process-refund'
import {processSanityWebhooks} from './core/services/process-sanity-webhooks'
import {createMagicLink} from './core/services/create-magic-link'
import {SkillRecordingsOptions} from './next'
import {postBulkFormDetailsToSlack} from './server/post-to-slack'

export type SkillRecordingsAction =
  | 'send-feedback'
  | 'test'
  | 'prices'
  | 'checkout'
  | 'webhook'
  | 'redeem'
  | 'subscriber'
  | 'answer'
  | 'subscribe'
  | 'lookup'
  | 'sign-s3'
  | 'claimed'
  | 'transfer'
  | 'nameUpdate'
  | 'refund'
  | 'create-magic-link'
  | 'bulk-form'

export type SkillRecordingsProvider =
  | 'stripe'
  | 'stripe-internal'
  | 'sanity'
  | 'convertkit'

export async function actionRouter({
  method,
  req,
  action,
  providerId,
  params,
  userOptions,
  token,
}: {
  method: string
  req: IncomingRequest
  action: SkillRecordingsAction
  providerId?: SkillRecordingsProvider
  params: any
  userOptions: SkillRecordingsOptions
  token: any
}) {
  const stripe = userOptions.paymentOptions?.providers.stripe?.paymentClient
  const paymentOptions = stripe ? {stripeCtx: {stripe}} : undefined

  if (method === 'GET') {
    switch (action) {
      case 'subscriber':
        return await convertkitLoadSubscriber({params})
      case 'sign-s3':
        return await signs3UploadUrl({params, token})
    }
  } else if (method === 'POST') {
    switch (action) {
      case 'send-feedback':
        return await sendFeedbackFromUser({
          emailAddress: req?.body?.email || token?.email,
          feedbackText: req?.body?.text,
          context: req?.body?.context,
          config: userOptions,
        })
      case 'redeem':
        return await redeemGoldenTicket({params, token})
      case 'checkout':
        return stripeCheckout({params, options: userOptions})
      case 'webhook':
        switch (providerId) {
          case 'stripe':
            return await receiveStripeWebhooks({
              params,
              paymentOptions: userOptions.paymentOptions,
            })
          case 'stripe-internal':
            return await receiveInternalStripeWebhooks({
              params,
              paymentOptions: userOptions.paymentOptions,
            })
          case 'sanity':
            return await processSanityWebhooks({params})
        }
        return await receiveStripeWebhooks({
          params,
          paymentOptions: userOptions.paymentOptions,
        })
      case 'subscribe':
        switch (providerId) {
          case 'convertkit':
            return await subscribeToConvertkit({params})
        }
        return await subscribeToConvertkit({params})
      case 'answer':
        return await convertkitAnswerQuizQuestion({params})
      case 'lookup':
        return await lookupUser({params})
      case 'claimed':
        return await claimedSeats({params})
      case 'nameUpdate':
        return await updateName({params})
      case 'transfer':
        return await transferPurchase({params, paymentOptions}) // update this to PaymentOptions
      case 'refund':
        return await stripeRefund({params, paymentOptions}) // update this to PaymentOptions
      case 'create-magic-link':
        return await createMagicLink({params})
      case 'bulk-form':
        try {
          const {name, email, seats, message, productName} = req.body

          const result = await postBulkFormDetailsToSlack(
            {name, email, seats, message},
            productName,
          )
          if (result) {
            return {
              status: 200,
              body: {success: true, message: 'Successfully sent to Slack'},
            }
          } else {
            return {
              status: 500,
              body: {success: false, message: 'Failed to send to Slack'},
            }
          }
        } catch (error) {
          console.error('Error sending to Slack:', error)
          return {
            status: 500,
            body: {success: false, message: 'Error sending to Slack'},
          }
        }
    }
  }

  return {
    status: 400,
    body: `Error: This action with HTTP ${method} is not supported by Skill Recordings` as any,
  }
}
