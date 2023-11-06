import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {prisma} from '@skillrecordings/database'

export async function claimedSeats({
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

    const bulkCouponId =
      (req.query?.bulkCouponId as string) || (req.body?.bulkCouponId as string)

    const users = await prisma.user.findMany({
      where: {
        purchases: {
          some: {
            redeemedBulkCouponId: bulkCouponId,
          },
        },
      },
      select: {
        name: true,
        email: true,
      },
    })

    return {
      status: 200,
      body: users,
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
