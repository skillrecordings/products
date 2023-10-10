import {prisma} from '@skillrecordings/database'
import {NextResponse} from 'next/server'
import {headers} from 'next/headers'
import {getUser} from './get-user'

export async function GET(request: Request) {
  const headersList = headers()
  const deviceAccessToken = headersList.get('Authorization')?.split(' ')[1]

  if (deviceAccessToken) {
    const token = await prisma.deviceAccessToken.findFirst({
      where: {
        token: deviceAccessToken,
      },
      select: {
        userId: true,
      },
    })

    if (token?.userId) {
      const user = await getUser(token.userId)
      return NextResponse.json(user)
    } else {
      return NextResponse.json(
        {
          error: 'not_found',
          error_description: 'User not found.',
        },
        {status: 404},
      )
    }
  } else {
    return NextResponse.json(
      {
        error: 'access_denied',
        error_description: 'Nothing to see here.',
      },
      {status: 403},
    )
  }
}
