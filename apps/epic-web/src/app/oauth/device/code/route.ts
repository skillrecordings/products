import {prisma} from '@skillrecordings/database'
import {hri} from 'human-readable-ids'
import {NextResponse} from 'next/server'

export async function POST() {
  const TEN_MINUTES_IN_MILLISECONDS = 60 * 10 * 1000
  const expires = new Date(Date.now() + TEN_MINUTES_IN_MILLISECONDS + 10000)

  const deviceVerification = await prisma.deviceVerification.create({
    data: {
      userCode: hri.random(),
      createdAt: new Date(),
      expires,
    },
  })

  return NextResponse.json({
    device_code: deviceVerification.deviceCode,
    user_code: deviceVerification.userCode,
    verification_uri: `${process.env.NEXT_PUBLIC_URL}/activate`,
    verification_uri_complete: `${process.env.NEXT_PUBLIC_URL}/activate?user_code=${deviceVerification.userCode}`,
    expires_in: TEN_MINUTES_IN_MILLISECONDS / 1000,
    interval: 5,
  })
}
