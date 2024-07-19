import {inngest} from '@/inngest/inngest.server'
import {v4} from 'uuid'
import {prisma} from '@skillrecordings/database'
import {
  nextSaturday,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from 'date-fns'
import {zonedTimeToUtc} from 'date-fns-tz'
import format from 'date-fns/format'
import {z} from 'zod'

export const ConvertkitSubscriberWebhookSchema = z.object({
  subscriber: z.object({
    id: z.coerce.number(),
    email_address: z.string(),
    first_name: z.string().optional().nullable(),
  }),
})

type ConvertkitSubscriberWebhook = z.infer<
  typeof ConvertkitSubscriberWebhookSchema
>

export const CONVERTKIT_WEBHOOK_EVENT = 'convertkit/webhook'

export type ConvertkitWebhookEvent = {
  name: typeof CONVERTKIT_WEBHOOK_EVENT
  data: ConvertkitSubscriberWebhook
}

const FORTY_PERCENT_OFF_COUPON_ID = 'kcd_d9993875-b6e4-4e67-9a09-0949f6b3b042'
const EPIC_REACT_PRO_PRODUCT_ID = 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38'

async function updateSubscriber(subscriber: {
  id: number
  fields: Record<string, string>
}) {
  const {fields} = subscriber
  return await fetch(
    `https://api.convertkit.com/v3/subscribers/${subscriber.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        api_secret: process.env.CONVERTKIT_API_SECRET,
        fields,
      }),
    },
  )
    .then((response) => response.json())
    .then(({subscriber}) => subscriber)
}

export const convertkitWebhookHandler = inngest.createFunction(
  {id: `convertkit-webhook`, name: 'Create Product in Database'},
  {
    event: CONVERTKIT_WEBHOOK_EVENT,
  },
  async ({event, step}) => {
    const now = new Date()
    const nextSat = nextSaturday(now)
    const midnightNextSat = setMilliseconds(
      setSeconds(setMinutes(setHours(nextSat, 0), 0), 0),
      0,
    )
    const pacificTime = zonedTimeToUtc(midnightNextSat, 'America/Los_Angeles')
    const couponId = v4()

    const coupon = await step.run('create coupon in database', async () => {
      return prisma.coupon.create({
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
    })

    const subscriber = await step.run('update subscriber', async () => {
      return await updateSubscriber({
        id: Number(event.data.subscriber.id),
        fields: {
          er_coupon_code: coupon.id,
          er_coupon_expires: pacificTime.getTime().toString(),
          er_discount_url: `https://epicreact.dev/buy?coupon=${coupon.id}&utm_source=convertkit&utm_medium=email&utm_campaign=react_course`,
          er_pitch_deadline: format(
            pacificTime,
            "EEEE MMMM d yyyy 'at' h:mm a 'Pacific'",
          ),
        },
      })
    })

    return {
      coupon,
      subscriber,
    }
  },
)
