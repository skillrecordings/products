import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {prisma} from '@skillrecordings/database'
import {stripe} from '@skillrecordings/commerce-server'

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

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: newName,
      },
    })

    if (costumerMerchantId) {
      const updateStripeCostumer = await stripe.customers.update(
        costumerMerchantId,
        {
          name: newName,
        },
      )
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
