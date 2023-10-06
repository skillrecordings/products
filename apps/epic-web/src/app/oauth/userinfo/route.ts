import {prisma} from '@skillrecordings/database'
import {NextResponse} from 'next/server'
import {headers} from 'next/headers'

export async function GET(request: Request) {
  const headersList = headers()
  const deviceAccessToken = headersList.get('Authorization')?.split(' ')[1]

  if (deviceAccessToken) {
    const token = await prisma.deviceAccessToken.findFirst({
      where: {
        token: deviceAccessToken,
      },
      include: {
        user: true,
      },
    })

    if (token?.user) {
      return NextResponse.json({
        email: token.user.email,
        name: token.user.name,
        image: token.user.image,
      })
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
