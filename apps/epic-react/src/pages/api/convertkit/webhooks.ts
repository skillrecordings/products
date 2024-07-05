import {NextApiRequest, NextApiResponse} from 'next'
import {
  nextSaturday,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from 'date-fns'
import {zonedTimeToUtc} from 'date-fns-tz'
import {prisma} from '@skillrecordings/database'
import {v4} from 'uuid'
import {updateSubscriber} from '@skillrecordings/convertkit-sdk'
import format from 'date-fns/format'

const FORTY_PERCENT_OFF_COUPON_ID = 'kcd_73aa8f63-fd91-407c-b3f2-c270542bb945'
const EPIC_REACT_PRO_PRODUCT_ID = 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38'

const convertkitWebhooks = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.query.api_key !== process.env.SKILL_CONVERTKIT_SECRET) {
    console.log('convertkit api secret does not match', req.query, req.body)
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    console.log({body: req.body})
    const {subscriber} = req.body

    const now = new Date()
    const nextSat = nextSaturday(now)
    const midnightNextSat = setMilliseconds(
      setSeconds(setMinutes(setHours(nextSat, 0), 0), 0),
      0,
    )
    const pacificTime = zonedTimeToUtc(midnightNextSat, 'America/Los_Angeles')
    const couponId = v4()

    const coupon = await prisma.coupon.create({
      data: {
        id: couponId,
        percentageDiscount: 0.4,
        maxUses: 1,
        expires: pacificTime,
        status: 1,
        merchantCouponId: FORTY_PERCENT_OFF_COUPON_ID,
        restrictedToProductId: EPIC_REACT_PRO_PRODUCT_ID,
      },
    })

    await updateSubscriber({
      id: Number(subscriber.id),
      fields: {
        er_coupon_code: coupon.id,
        er_coupon_expires: pacificTime.getTime().toString(),
        er_discount_url: `https://epicreact.dev?coupon=${coupon.id}&utm_source=convertkit&utm_medium=email&utm_campaign=react_course`,
        er_pitch_deadline: format(pacificTime, 'EEEE MMMM do yyyy at h:mm a'),
      },
    })
  } else {
    res.status(200).end()
  }
}

export default convertkitWebhooks
