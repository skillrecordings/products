import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {prisma} from '@skillrecordings/database'
import {
  defaultContext as defaultStripeContext,
  Stripe,
} from '@skillrecordings/stripe-sdk'

const {stripe: defaultStripe} = defaultStripeContext

export async function transferPurchase({
  params,
  paymentOptions,
}: {
  params: SkillRecordingsHandlerParams
  paymentOptions: {stripeCtx: {stripe: Stripe}} | undefined
}): Promise<OutgoingResponse> {
  try {
    const {req} = params
    const skillSecret = req.headers['x-skill-secret'] as string

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

    const purchaseId =
      (req.query?.purchaseId as string) || (req.body?.purchaseId as string)

    const sourceUserId =
      (req.query?.sourceUserId as string) || (req.body?.sourceUserId as string)

    const targetUserEmail =
      (req.query?.targetUserEmail as string) ||
      (req.body?.targetUserEmail as string)

    if (!purchaseId || !sourceUserId || !targetUserEmail) {
      return {
        status: 400,
        body: {
          error: true,
          message: 'Missing required parameters',
        },
      }
    }

    // looks for the id of the target email

    let targetUserId = await prisma.user.findUnique({
      where: {
        email: targetUserEmail,
      },
      select: {
        id: true,
      },
    })

    // If the target user doesn't exist, create a new user.

    if (!targetUserId) {
      const createUser = await prisma.user.create({
        data: {
          email: targetUserEmail,
          roles: 'User',
          emailVerified: new Date(),
        },
      })
      targetUserId = {id: createUser.id}
    }

    // creates a transfer record

    const createTransfer = await prisma.purchaseUserTransfer.create({
      data: {
        purchaseId: purchaseId,
        transferState: 'COMPLETED',
        sourceUserId: sourceUserId,
        targetUserId: targetUserId?.id,
        completedAt: new Date(),
      },
    })

    if (!createTransfer) {
      return {
        status: 500,
        body: {
          error: true,
          message: 'Error creating transfer',
        },
      }
    }

    // updates purchase table with targetUserId

    const updatePurchase = await prisma.purchase.update({
      where: {
        id: purchaseId,
        userId: sourceUserId,
      },
      data: {
        userId: targetUserId.id,
      },
    })

    // update merchant records if the purchase involved stripe

    if (updatePurchase.merchantChargeId) {
      const updateMerchantCharge = await prisma.merchantCharge.update({
        where: {
          id: updatePurchase.merchantChargeId,
        },
        data: {
          userId: targetUserId.id,
        },
      })
      const updateMerchantCustomer = await prisma.merchantCustomer.update({
        where: {
          id: updateMerchantCharge.merchantCustomerId,
        },
        data: {
          userId: targetUserId.id,
        },
      })
      const updateStripeCostumer = await stripe.customers.update(
        updateMerchantCustomer.identifier,
        {
          email: targetUserEmail,
          metadata: {
            siteName: process.env.NEXT_PUBLIC_APP_NAME,
          },
        },
      )
    }

    return {
      status: 200,
      body: updatePurchase,
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
