import {prisma} from '@skillrecordings/database'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const device_code = formData.get('device_code')

  const deviceVerification = await prisma.deviceVerification.findFirst({
    where: {
      deviceCode: device_code as string,
    },
  })

  if (deviceVerification) {
    if (
      !deviceVerification.verifiedAt &&
      new Date() > deviceVerification.expires
    ) {
      return NextResponse.json(
        {
          error: 'expired_token',
          error_description: 'The device verification has expired',
        },
        {status: 403},
      )
    }

    if (!deviceVerification.verifiedAt) {
      return NextResponse.json(
        {
          error: 'authorization_pending',
          error_description: 'The device verification is pending',
        },
        {status: 403},
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: deviceVerification.verifiedByUserId as string,
      },
    })

    if (user) {
      const deviceToken = await prisma.deviceAccessToken.create({
        data: {
          userId: user.id,
        },
      })

      await prisma.deviceVerification.delete({
        where: {
          deviceCode: deviceVerification.deviceCode,
        },
      })

      return NextResponse.json({
        access_token: deviceToken.token,
        token_type: 'bearer',
        scope: 'content:read progress',
      })
    } else {
      return NextResponse.json(
        {
          error: 'access_denied',
          error_description: 'User not found',
        },
        {status: 403},
      )
    }
  } else {
    return NextResponse.json(
      {
        error: 'access_denied',
        error_description: 'The device code is invalid',
      },
      {status: 403},
    )
  }
}
