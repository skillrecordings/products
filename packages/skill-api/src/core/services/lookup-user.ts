import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {prisma} from '@skillrecordings/database'

export async function lookupUser({
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

    const email = (req.query?.email as string) || (req.body?.email as string)

    const user = await prisma.user.findUnique({
      where: {email},
      select: {
        roles: true,
        id: true,
        name: true,
        email: true,
        merchantCustomers: true,
        purchases: {
          select: {
            id: true,
            country: true,
            status: true,
            merchantCharge: {
              select: {
                id: true,
                identifier: true,
                merchantCustomer: {
                  select: {
                    identifier: true,
                  },
                },
              },
            },
            productId: true,
            createdAt: true,
            totalAmount: true,
            bulkCouponId: true,
            bulkCoupon: {
              select: {
                maxUses: true,
                usedCount: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return {
      status: 200,
      body: user,
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
