import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {prisma} from '@skillrecordings/database'
import {defaultContext as defaultStripeContext} from '@skillrecordings/stripe-sdk'

const {stripe} = defaultStripeContext

export async function updateName({
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

    const userId = (req.query?.userId as string) || (req.body?.userId as string)
    const newName =
      (req.query?.newName as string) || (req.body?.newName as string)
    const costumerMerchantId =
      (req.query?.costumerMerchantId as string) ||
      (req.body?.costumerMerchantId as string)

    if (!userId || !newName) {
      return {
        status: 400,
        body: {
          error: true,
          message: 'Missing required parameters: userId or newName',
        },
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: {id: userId},
    })

    if (!existingUser) {
      return {
        status: 404,
        body: {
          error: true,
          message: 'User not found',
        },
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: newName,
      },
    })

    if (costumerMerchantId) {
      try {
        await stripe.customers.update(costumerMerchantId, {
          name: newName,
        })
      } catch (stripeError) {
        console.error('Error updating Stripe customer:', stripeError)
        return {
          status: 200,
          body: {
            ...updatedUser,
            warning: 'User updated in database, but Stripe update failed',
          },
        }
      }
    }

    return {
      status: 200,
      body: updatedUser,
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
