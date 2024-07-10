import {SkillRecordingsHandlerParams} from '../types'
import {OutgoingResponse} from '../index'
import {getSdk, prisma} from '@skillrecordings/database'
import {
  recordNewPurchase,
  NO_ASSOCIATED_PRODUCT,
  StripeProvider,
  defaultPaymentOptions,
} from '@skillrecordings/commerce-server'
import {buffer} from 'micro'
import {postSaleToSlack, sendServerEmail} from '../../server' // TODO: add import path helper to tsconfig
import type {PaymentOptions} from '@skillrecordings/commerce-server'
import {convertkitTagPurchase} from './convertkit'
import {Inngest} from 'inngest'
import {
  STRIPE_CHECKOUT_COMPLETED_EVENT,
  STRIPE_WEBHOOK_RECEIVED_EVENT,
} from '@skillrecordings/inngest'
import {
  defaultContext as defaultStripeContext,
  Stripe,
} from '@skillrecordings/stripe-sdk'
import {z} from 'zod'
import nodeFetch, {Headers} from 'node-fetch'

const {stripe: defaultStripe} = defaultStripeContext

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

const METADATA_MISSING_SITE_NAME = 'metadata-missing-site-name'

// type PaymentOptions = {stripeCtx: {stripe: Stripe}}

const getStripeClient = (paymentOptions: PaymentOptions | undefined) => {
  return paymentOptions?.providers.stripe?.paymentClient
}

const constructFallbackStripePaymentOptions = (
  stripe: Stripe,
): PaymentOptions => {
  return defaultPaymentOptions({
    stripeProvider: StripeProvider({defaultStripeClient: stripe}),
  })
}

export async function receiveInternalStripeWebhooks({
  params,
  paymentOptions,
}: {
  params: SkillRecordingsHandlerParams
  paymentOptions: PaymentOptions | undefined
}): Promise<OutgoingResponse> {
  try {
    const {
      req,
      options: {nextAuthOptions},
    } = params

    const skillSecret = req.headers['x-skill-secret'] as string

    if (skillSecret !== process.env.SKILL_SECRET) {
      return {
        status: 401,
        body: {
          error: 'Unauthorized',
        },
      }
    }

    console.log(
      'stripe webhook (internal) received for ',
      process.env.NEXT_PUBLIC_APP_NAME,
    )

    const _paymentOptions =
      paymentOptions || constructFallbackStripePaymentOptions(defaultStripe)

    const event = req.body.event

    return await processStripeWebhook(event, {
      nextAuthOptions,
      paymentOptions: _paymentOptions,
    })
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}

const determineEventProcessor = (siteName: string) => {
  if (siteName === 'testing-javascript') {
    const internalStripeWebhookEndpoint = z
      .string()
      .parse(process.env.TESTING_JAVASCRIPT_INTERNAL_STRIPE_URL)
    const skillSecret = z
      .string({
        required_error: 'TJS_SKILL_SECRET must be set in this environemnt',
      })
      .parse(process.env.TJS_SKILL_SECRET)

    return {
      handler: 'testing-javascript' as const,
      details: {
        skillSecret,
        webhookEndpoint: internalStripeWebhookEndpoint,
      },
    }
  } else if (siteName === 'epic-react') {
    const internalStripeWebhookEndpoint = z
      .string()
      .parse(process.env.EPIC_REACT_INTERNAL_STRIPE_URL)
    const skillSecret = z
      .string({
        required_error: 'ER_SKILL_SECRET must be set in this environemnt',
      })
      .parse(process.env.ER_SKILL_SECRET)

    return {
      handler: 'epic-react' as const,
      details: {
        skillSecret,
        webhookEndpoint: internalStripeWebhookEndpoint,
      },
    }
  } else {
    return {
      handler: 'self' as const,
    }
  }
}

export async function receiveStripeWebhooks({
  params,
  paymentOptions,
}: {
  params: SkillRecordingsHandlerParams
  paymentOptions: PaymentOptions | undefined
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

    const _paymentOptions =
      paymentOptions || constructFallbackStripePaymentOptions(defaultStripe)
    const stripe = getStripeClient(paymentOptions) || defaultStripe

    if (!stripe) {
      throw new Error('Stripe client is missing')
    }

    const buf = await buffer(rawReq)
    const sig = req.headers['stripe-signature']

    let event: any

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret)

      if (process.env.INNGEST_EVENT_KEY) {
        console.log('sending inngest webhook received event')
        const inngest = new Inngest({
          id:
            process.env.INNGEST_APP_NAME ||
            process.env.NEXT_PUBLIC_SITE_TITLE ||
            'Stripe Handler',
          eventKey: process.env.INNGEST_EVENT_KEY,
        })
        await inngest.send({
          name: STRIPE_WEBHOOK_RECEIVED_EVENT,
          data: event,
        })
      }

      const {siteName: targetSiteName} = z
        .object({siteName: z.string().default(METADATA_MISSING_SITE_NAME)})
        .parse(event.data.object.metadata)

      const {handler, details} = determineEventProcessor(targetSiteName)

      if (handler !== 'self') {
        const {skillSecret, webhookEndpoint} = details

        const payloadString = JSON.stringify({event})
        const contentLength = Buffer.byteLength(payloadString, 'utf8')

        const headers = new Headers({
          'Content-Type': 'application/json',
          'x-skill-secret': skillSecret,
          'Content-Length': contentLength.toString(),
        })

        // not awaiting the fetch so that endpoint can return 200 right away
        await nodeFetch(webhookEndpoint, {
          method: 'POST',
          headers,
          body: payloadString,
        })

        return {status: 200, body: `handled by ${handler}`}
      } else {
        return await processStripeWebhook(event, {
          nextAuthOptions,
          paymentOptions: _paymentOptions,
        })
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

type NextAuthOptions =
  SkillRecordingsHandlerParams['options']['nextAuthOptions']

export const processStripeWebhook = async (
  event: any,
  options: {
    nextAuthOptions: NextAuthOptions
    paymentOptions: PaymentOptions
  },
) => {
  const {paymentOptions, nextAuthOptions} = options

  const stripeProvider = paymentOptions.providers.stripe

  if (!stripeProvider) {
    throw new Error(
      'Stripe Provider must be configured to process Stripe webhooks',
    )
  }

  console.log(
    'processing stripe webhook for ',
    process.env.NEXT_PUBLIC_APP_NAME,
  )
  console.log('paymentOptions', paymentOptions)

  const eventType: string = event.type
  const stripeIdentifier: string = event.data.object.id
  const eventObject = event.data.object

  console.log('eventType', eventType)
  console.log('stripeIdentifier', stripeIdentifier)
  console.log('eventObject', eventObject)

  console.log('------')

  const {
    updatePurchaseStatusForCharge,
    findOrCreateUser,
    transferPurchasesToNewUser,
  } = getSdk()

  if (eventType === 'checkout.session.completed') {
    const {user, purchase, purchaseInfo} = await recordNewPurchase(
      stripeIdentifier,
      {paymentProvider: stripeProvider},
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
        callbackUrl: `${process.env.NEXT_PUBLIC_URL}/welcome?purchaseId=${purchase.id}&provider=stripe`,
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
  } else if (eventType === 'charge.refunded') {
    const chargeId = stripeIdentifier
    await updatePurchaseStatusForCharge(chargeId, 'Refunded')
    return {
      status: 200,
      body: 'success!',
    }
  } else if (eventType === 'charge.dispute.created') {
    const chargeId = stripeIdentifier
    await updatePurchaseStatusForCharge(chargeId, 'Disputed')
    return {
      status: 200,
      body: 'success!',
    }
  } else if (eventType === 'customer.updated') {
    const merchantCustomer = await prisma.merchantCustomer.findFirst({
      where: {
        identifier: stripeIdentifier,
      },
      include: {
        user: true,
      },
    })

    const currentUser = merchantCustomer?.user

    if (currentUser) {
      const {email: targetEmail, name} = z
        .object({
          email: z.string(),
          name: z.string().optional(),
        })
        .parse(eventObject)

      const {previous_attributes} = z
        .object({
          previous_attributes: z
            .object({email: z.string().optional()})
            .optional(),
        })
        .parse(event.data)

      const previousEmail = previous_attributes?.email

      const transferringToDifferentUser = previousEmail
        ? targetEmail.toLowerCase() !== previousEmail.toLowerCase()
        : false

      const {user: updateUser} = await findOrCreateUser(targetEmail, name)

      await transferPurchasesToNewUser({
        merchantCustomerId: merchantCustomer.id,
        userId: updateUser.id,
      })

      if (transferringToDifferentUser && nextAuthOptions) {
        await sendServerEmail({
          email: targetEmail,
          callbackUrl: `${process.env.NEXTAUTH_URL}`,
          nextAuthOptions,
        })
      }
    } else {
      console.log(`no user found for customer ${stripeIdentifier}`)
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
}
