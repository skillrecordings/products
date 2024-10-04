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

    const sourceUser = await prisma.user.findUnique({
      where: {
        id: sourceUserId,
      },
      select: {
        id: true,
        email: true,
        merchantCharges: {
          select: {
            id: true,
            merchantCustomer: true,
          },
        },
        merchantCustomers: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!sourceUser) {
      return {
        status: 404,
        body: {
          error: true,
          message: 'Source user not found',
        },
      }
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        id: purchaseId,
        userId: sourceUser.id,
      },
      select: {
        id: true,
        merchantCharge: {
          select: {
            id: true,
            merchantCustomer: true,
          },
        },
      },
    })

    if (!purchase) {
      return {
        status: 404,
        body: {
          error: true,
          message: 'Purchase not found',
        },
      }
    }

    const targetUserEmail =
      (req.query?.targetUserEmail as string) ||
      (req.body?.targetUserEmail as string)

    if (!targetUserEmail) {
      return {
        status: 400,
        body: {
          error: true,
          message: 'Missing required parameters',
        },
      }
    }

    // looks for the id of the target email

    let targetUser = await prisma.user.findUnique({
      where: {
        email: targetUserEmail,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    // If the target user doesn't exist, create a new user.

    if (!targetUser) {
      const createUser = await prisma.user.create({
        data: {
          email: targetUserEmail,
          roles: 'User',
        },
      })

      targetUser = await prisma.user.findUnique({
        where: {
          id: createUser.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      })
    }

    if (!targetUser) {
      return {
        status: 404,
        body: {
          error: true,
          message: 'Target user not found',
        },
      }
    }

    console.log(
      `transfer ${purchase.id} from ${sourceUser.email} to ${targetUser.email}`,
    )

    // creates a transfer record
    // update merchant records if the purchase involved stripe

    if (purchase?.merchantCharge?.merchantCustomer) {
      console.log(
        `stripe customer ${purchase.merchantCharge.merchantCustomer.identifier}`,
      )
      const {identifier} = purchase.merchantCharge.merchantCustomer

      // try {
      //   const existingCustomer = (await stripe.customers.retrieve(
      //     identifier,
      //   )) as Stripe.Response<Stripe.Customer>

      //   await stripe.customers.update(identifier, {
      //     email: targetUser.email,
      //     name: targetUser.name || existingCustomer.name || targetUser.email,
      //   })
      // } catch (error) {
      //   console.error('Error updating stripe customer', error)
      // }

      console.log(
        `update ${purchase.merchantCharge.id} user to ${targetUser.id}`,
      )

      // const updateMerchantCharge = prisma.merchantCharge.update({
      //   where: {
      //     id: purchase.merchantCharge.id,
      //   },
      //   data: {
      //     userId: targetUser.id,
      //   },
      // })

      console.log(
        `update ${purchase.merchantCharge.merchantCustomer.id} user to ${targetUser.id}`,
      )

      // const updateMerchantCustomer = prisma.merchantCustomer.update({
      //   where: {
      //     id: purchase.merchantCharge.merchantCustomer.id,
      //   },
      //   data: {
      //     userId: targetUser.id,
      //   },
      // })

      // await prisma.$transaction([updateMerchantCharge, updateMerchantCustomer])
    }

    console.log(`transfer`, {
      purchaseId: purchase.id,
      transferState: 'COMPLETED',
      sourceUserId: sourceUser.id,
      targetUserId: targetUser.id,
      completedAt: new Date(),
    })

    // const createTransfer = prisma.purchaseUserTransfer.create({
    //   data: {
    //     purchaseId: purchase.id,
    //     transferState: 'COMPLETED',
    //     sourceUserId: sourceUser.id,
    //     targetUserId: targetUser.id,
    //     completedAt: new Date(),
    //   },
    // })

    console.log(`update purchase [${purchase.id}] to ${targetUser.email}`)

    // const updatePurchase = prisma.purchase.update({
    //   where: {
    //     id: purchase.id,
    //     userId: sourceUser.id,
    //   },
    //   data: {
    //     userId: targetUser.id,
    //   },
    // })

    // const [updatedPurchase] = await prisma.$transaction([
    //   updatePurchase,
    //   createTransfer,
    // ])

    return {
      status: 200,
      body: 'updatedPurchase',
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
