import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {prisma, User} from '@skillrecordings/database'

const convertkitSubscriberHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    if (req.query.frontToken !== process.env.FRONT_INTEGRATION_TOKEN) {
      throw new Error('not allowed')
    }
    if (req.method === 'GET' && req.query.userEmail) {
      console.log(req.query)
      const user = await prisma.user.findFirst({
        where: {
          email: req.query.userEmail as string,
        },
      })
      const purchases =
        user &&
        (await prisma.purchase.findMany({
          where: {
            userId: user.id,
          },
          include: {
            merchantCharge: true,
            product: true,
          },
        }))
      res.status(200).json({...user, purchases})
    } else {
      res.status(200).end()
    }
  } catch (e) {
    res.status(404)
  }
}

export default withSentry(convertkitSubscriberHandler)
export const config = {
  api: {
    externalResolver: true,
  },
}
