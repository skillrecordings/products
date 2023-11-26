import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {prisma} from '@skillrecordings/database'
import {stripe} from '@skillrecordings/commerce-server'

export async function transferPurchase({
  params,
}: {
  params: SkillRecordingsHandlerParams
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

    const purchaseId =
      (req.query?.purchaseId as string) || (req.body?.purchaseId as string)

    const sourceUserId =
      (req.query?.sourceUserId as string) || (req.body?.sourceUserId as string)

    const targetUserEmail =
      (req.query?.targetUserEmail as string) ||
      (req.body?.targetUserEmail as string)

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

    // updates purchase table with targetUserId

    const updatePurchase = await prisma.purchase.update({
      where: {
        id: purchaseId,
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
