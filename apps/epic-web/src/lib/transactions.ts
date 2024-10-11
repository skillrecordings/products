import {paymentOptions} from 'pages/api/skill/[...skillRecordings]'
import Stripe from 'stripe'
import {z} from 'zod'

const stripe = paymentOptions.providers.stripe?.paymentClient as Stripe

export const SimplifiedChargeSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  created: z.number(),
  status: z.string(),
  product: z.string().nullable(),
  productId: z.string().nullable(),
  siteName: z.string().nullable(),
  country: z.string().nullable(),
  net: z.number(),
  fee: z.number(),
})

export type SimplifiedCharge = z.infer<typeof SimplifiedChargeSchema>

function simplifyCharge(charge: Stripe.Charge): SimplifiedCharge {
  const balanceTransaction =
    charge.balance_transaction as Stripe.BalanceTransaction
  return SimplifiedChargeSchema.parse({
    id: charge.id,
    amount: charge.amount,
    currency: charge.currency,
    created: charge.created,
    status: charge.status,
    product: charge.metadata.product || null,
    productId: charge.metadata.productId || null,
    siteName: charge.metadata.siteName || null,
    country: charge.metadata.country || null,
    net: balanceTransaction?.net || 0,
    fee: balanceTransaction?.fee || 0,
  })
}

async function fetchChargesWithRetry(
  params: Stripe.ChargeListParams,
  maxRetries = 3,
): Promise<Stripe.ApiList<Stripe.Charge>> {
  let retries = 0
  while (retries < maxRetries) {
    try {
      return await stripe.charges.list(params)
    } catch (error) {
      if (error instanceof Stripe.errors.StripeRateLimitError) {
        retries++
        console.log(`Rate limit hit, retrying (${retries}/${maxRetries})...`)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retries) * 1000),
        )
      } else {
        throw error
      }
    }
  }
  throw new Error('Max retries reached when fetching charges')
}

function getDateRange(range: string): {start: Date; end: Date} {
  const now = new Date()
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )
  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  )

  switch (range) {
    case 'today':
      break
    case 'yesterday':
      start.setUTCDate(start.getUTCDate() - 1)
      end.setUTCDate(end.getUTCDate() - 1)
      break
    case 'last-week':
      start.setUTCDate(start.getUTCDate() - 7)
      end.setUTCDate(end.getUTCDate() - 1)
      break
    case 'month-so-far':
      start.setUTCDate(1)
      break
    case 'last-month':
      start.setUTCMonth(start.getUTCMonth() - 1, 1)
      end.setUTCDate(0)
      break
    default:
    // Default to today
  }

  return {start, end}
}

export const FetchChargesSchema = z.object({
  range: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
})

export async function fetchCharges({
  range,
  start,
  end,
}: z.infer<typeof FetchChargesSchema>): Promise<SimplifiedCharge[]> {
  let startDate: Date
  let endDate: Date

  if (start && end) {
    startDate = new Date(start)
    endDate = new Date(end)
    // Ensure the provided dates are interpreted as UTC
    startDate.setUTCHours(0, 0, 0, 0)
    endDate.setUTCHours(23, 59, 59, 999)
  } else if (range) {
    const dateRange = getDateRange(range)
    startDate = dateRange.start
    endDate = dateRange.end
  } else {
    const dateRange = getDateRange('today')
    startDate = dateRange.start
    endDate = dateRange.end
  }

  let allCharges: SimplifiedCharge[] = []
  let hasMore = true
  let startingAfter: string | undefined = undefined

  while (hasMore) {
    const charges: Stripe.ApiList<Stripe.Charge> = await fetchChargesWithRetry({
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lte: Math.floor(endDate.getTime() / 1000),
      },
      expand: ['data.balance_transaction'],
      limit: 100,
      starting_after: startingAfter,
    })

    const simplifiedCharges = charges.data
      .filter((charge) => charge.status === 'succeeded')
      .map(simplifyCharge)
    allCharges = allCharges.concat(simplifiedCharges)
    hasMore = charges.has_more
    startingAfter = charges.data[charges.data.length - 1]?.id
  }

  console.log(
    `Fetched ${
      allCharges.length
    } succeeded charges for ${startDate.toISOString()} to ${endDate.toISOString()}`,
  )

  return allCharges
}
