import {getSdk, prisma} from '@skillrecordings/database'
import type {IncomingMessage, ServerResponse} from 'http'
import type {NextApiRequestCookies} from 'next/dist/server/api-utils'
import {getToken} from 'next-auth/jwt'
import {User, UserSchema} from '@skillrecordings/skill-lesson'
import {
  Subscriber,
  SubscriberSchema,
} from '@skillrecordings/skill-lesson/schemas/subscriber'
import {fetchSubscriber} from '@skillrecordings/convertkit-sdk'
import {serialize} from 'cookie'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {ParsedUrlQuery} from 'querystring'

export async function loadUserForToken({
  token,
  deviceToken,
}: {
  token?: any
  deviceToken?: string
}) {
  let userId
  if (token) {
    userId = token.id
  } else if (deviceToken) {
    const deviceAccessToken = await prisma.deviceAccessToken.findFirst({
      where: {
        token: deviceToken,
      },
      select: {
        userId: true,
      },
    })
    if (deviceAccessToken?.userId) {
      userId = deviceAccessToken.userId
    }
  }

  if (userId) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        purchases: true,
      },
    })
  }
}

export async function getUserAndSubscriber({
  req,
  res,
  query,
}: {
  req: IncomingMessage & {
    cookies: NextApiRequestCookies
  }
  res: ServerResponse
  query?: ParsedUrlQuery
}) {
  const token = await getToken({req})
  const {getUserByEmail} = getSdk()

  const parsedToken = token && UserSchema.safeParse(token)

  let user: User | null = null
  let subscriber: Subscriber | null = null

  if (parsedToken?.success) {
    user = await getUserByEmail(parsedToken.data.email)
  }

  let rawSubscriber = null

  if (req.cookies['ck_subscriber']) {
    try {
      rawSubscriber = JSON.parse(req.cookies['ck_subscriber'])
    } catch (e) {
      console.debug('error parsing ck_subscriber cookie', e)
    }
  }

  if (rawSubscriber?.id || query?.ck_subscriber_id) {
    try {
      rawSubscriber = await fetchSubscriber(
        (rawSubscriber?.id || query?.ck_subscriber_id) as string,
      )
    } catch (e) {
      console.log('error fetching ck_subscriber cookie', e)
    }
  }

  const parsedSubscriber = SubscriberSchema.safeParse(rawSubscriber)

  if (parsedSubscriber.success) {
    subscriber = parsedSubscriber.data
    user = user ? user : await getUserByEmail(subscriber.email_address)
    res.setHeader(
      'Set-Cookie',
      serialize('ck_subscriber', JSON.stringify(subscriber), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 31556952,
      }),
    )
  }

  return {
    user: convertToSerializeForNextResponse(user),
    subscriber: convertToSerializeForNextResponse(subscriber),
  }
}
