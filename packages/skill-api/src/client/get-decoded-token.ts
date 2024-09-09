import {prisma, Purchase, User} from '@skillrecordings/database'
import {getToken, GetTokenParams} from 'next-auth/jwt'

async function loadUserForToken({
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

export async function getDecodedToken<R extends boolean = false>(
  params: GetTokenParams<R>,
  deviceToken?: string,
) {
  const token = getToken(params)

  const user: (User & {purchases: Purchase[]}) | undefined | null = deviceToken
    ? await loadUserForToken({deviceToken})
    : undefined

  return user || token || null
}
