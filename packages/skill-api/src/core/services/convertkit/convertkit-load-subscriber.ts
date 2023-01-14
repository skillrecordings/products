import {SkillRecordingsHandlerParams} from '../../types'
import {OutgoingResponse} from '../../index'
import {
  fetchSubscriber,
  getConvertkitSubscriberCookie,
  getSubscriberByEmail,
} from '@skillrecordings/convertkit-sdk'
import {prisma} from '@skillrecordings/database'
import {getToken} from 'next-auth/jwt'
import {NextApiRequest} from 'next'
import {inngest} from '@skillrecordings/inngest'

export async function convertkitLoadSubscriber({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    let subscriber
    const token = await getToken({req: params.req as unknown as NextApiRequest})

    const convertkitId =
      params.req.query[
        process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY || 'ck_subscriber_id'
      ] ||
      params.req.cookies?.[
        process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY || 'ck_subscriber_id'
      ]

    if (convertkitId) {
      subscriber = await fetchSubscriber(convertkitId as string)
    } else if (params.req.query.learner || token) {
      const user = await prisma.user.findUnique({
        where: {id: (params.req.query.learner as string) || token?.sub},
      })
      subscriber = user?.email && (await getSubscriberByEmail(user?.email))
    } else if (params.req.cookies?.['ck_subscriber']) {
      subscriber = JSON.parse(params.req.cookies['ck_subscriber'])
    }

    if (subscriber) {
      return {
        status: 200,
        body: subscriber,
        cookies: getConvertkitSubscriberCookie(subscriber),
        headers: [{key: 'Cache-Control', value: 'max-age=10'}],
      }
    } else {
      return {
        status: 200,
      }
    }
  } catch (error) {
    return {
      status: 200,
    }
  }
}
