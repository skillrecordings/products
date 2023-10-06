import {prisma} from '@skillrecordings/database'

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
