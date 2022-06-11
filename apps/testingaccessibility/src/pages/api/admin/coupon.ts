import type {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from 'utils/honeycomb-tracer'
import {getToken} from 'next-auth/jwt'
import prisma from '../../../db'
const ROLES_WITH_ACCESS = ['ADMIN', 'SUPERADMIN']

const redeemHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: redeemHandler.name, tracer, req, res})
  const token = await getToken({req})

  if (!ROLES_WITH_ACCESS.includes(token?.roles as string)) {
    res.status(404).end()
    return
  }

  if (req.method === 'GET') {
    try {
      const {quantity} = req.query

      const quantityToGenerate = Number(quantity)

      let codes = ``

      for (let i = 0; i < quantityToGenerate; i++) {
        const coupon = await prisma.coupon.create({
          data: {
            percentageDiscount: 1,
            maxUses: 1,
          },
        })
        codes += `${process.env.NEXT_PUBLIC_URL}?code=${coupon.id}\n`
      }

      res.status(200).send(codes)
    } catch (error: any) {
      Sentry.captureException(error)
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-GET request made')
    res.status(404).end()
  }
}

export default withSentry(redeemHandler)

export const config = {
  api: {
    externalResolver: true,
  },
}
