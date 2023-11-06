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

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: newName,
      },
    })

    const merchantCustomerId = await prisma.merchantCustomer.findFirstOrThrow({
      where: {
        userId: userId,
      },
      select: {
        identifier: true,
      },
    })

    if (merchantCustomerId) {
      const updateStripeCostumer = await stripe.customers.update(
        merchantCustomerId.identifier,
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
