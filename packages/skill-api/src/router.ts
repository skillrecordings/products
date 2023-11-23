import renderPage from './core/pages'
import {
  convertkitAnswerQuizQuestion,
  convertkitLoadSubscriber,
  subscribeToConvertkit,
} from './core/services/convertkit'
import {signs3UploadUrl} from './core/services/aws'
import {sendFeedbackFromUser} from './core/services/send-feedback-from-user'
import {redeemGoldenTicket} from './core/services/redeem-golden-ticket'
import {loadPrices} from './core/services/load-prices'
import {stripeCheckout} from './core/services/stripe-checkout'
import {processStripeWebhooks} from './core/services/process-stripe-webhook'
import {lookupUser} from './core/services/lookup-user'
import {IncomingRequest} from './core'
import {claimedSeats} from './core/services/claimed-seats'
import {updateName} from './core/services/update-name'
import {transferPurchase} from './core/services/transfer-purchase'
import {stripeRefund} from './core/services/process-refund'
import {processSanityProductsWebhook} from './core/services/sanity/process-sanity-products-webhook'

export async function actionRouter({
  method,
  req,
  action,
  params,
  userOptions,
  token,
}: {
  method: string
  req: IncomingRequest
  action: any
  params: any
  userOptions: any
  token: any
}) {
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
      case 'prices':
        return await loadPrices({params})
      case 'checkout':
        return stripeCheckout({params})
      case 'webhook':
        return await processStripeWebhooks({params})
      case 'subscribe':
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
        return await transferPurchase({params})
      case 'refund':
        return await stripeRefund({params})
      case 'sanity-products-webhook':
        return await processSanityProductsWebhook({params})
    }
  }

  return {
    status: 400,
    body: `Error: This action with HTTP ${method} is not supported by Skill Recordings` as any,
  }
}
