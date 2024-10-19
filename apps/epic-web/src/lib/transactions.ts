import {paymentOptions} from 'pages/api/skill/[...skillRecordings]'
import Stripe from 'stripe'
import {z} from 'zod'

const stripe = paymentOptions.providers.stripe?.paymentClient as Stripe

export const SimplifiedChargeSchema = z.object({
  id: z.string(),
  amount: z.number(),
  amountRefunded: z.number(),
  currency: z.string(),
  created: z.number(),
  status: z.string(),
  product: z.string().nullable(),
  productId: z.string().nullable(),
  siteName: z.string().nullable(),
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
    amountRefunded: charge.amount_refunded,
    currency: charge.currency,
    created: charge.created,
    status: charge.status,
    product: charge.metadata.product || null,
    productId: charge.metadata.productId || null,
    siteName: charge.metadata.siteName || null,
    net: balanceTransaction?.net || 0,
    fee: balanceTransaction?.fee || 0,
  })
}

const SimplifiedRefundSchema = z.object({
  id: z.string(),
  amount: z.number(),
  created: z.number(),
  currency: z.string(),
  chargeId: z.string(),
  receiptNumber: z.string().nullable(),
  status: z.string(),
  metadata: z.record(z.string(), z.string()).nullable(),
  product: z.string(),
  productId: z.string().nullable(),
})

export type SimplifiedRefund = z.infer<typeof SimplifiedRefundSchema>

function simplifyRefund(refund: Stripe.Refund): SimplifiedRefund {
  let product = 'Unknown Product'
  let productId = null

  if (refund.charge && typeof refund.charge !== 'string') {
    product = refund.charge.metadata.product || product
    productId = refund.charge.metadata.productId || productId
  } else {
    console.log('Charge is not expanded or is a string:', refund.charge)
  }

  // If product is still unknown, check refund metadata
  if (product === 'Unknown Product') {
    product = refund.metadata?.product || product
    productId = refund.metadata?.productId || productId
  }

  return SimplifiedRefundSchema.parse({
    id: refund.id,
    amount: refund.amount,
    currency: refund.currency,
    created: refund.created,
    status: refund.status,
    chargeId:
      typeof refund.charge === 'string' ? refund.charge : refund.charge?.id,
    receiptNumber: refund.receipt_number || null,
    metadata: refund.metadata || null,
    product,
    productId,
  })
}

async function fetchChargesWithRetry(
  params: Stripe.ChargeListParams,
  maxRetries = 3,
): Promise<Stripe.ApiList<Stripe.Charge>> {
  let retries = 0
  while (retries < maxRetries) {
    try {
      console.log(`Fetching charges with params: ${JSON.stringify(params)}`)
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

async function fetchRefundsWithRetry(
  params: Stripe.RefundListParams,
  maxRetries = 3,
): Promise<Stripe.ApiList<Stripe.Refund>> {
  let retries = 0
  while (retries < maxRetries) {
    try {
      console.log(`Fetching refunds with params: ${JSON.stringify(params)}`)
      return await stripe.refunds.list(params)
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
  throw new Error('Max retries reached when fetching refunds')
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
    case 'this-week':
      start.setUTCDate(start.getUTCDate() - start.getUTCDay())
      break
    case 'last-week':
      start.setUTCDate(start.getUTCDate() - 7 - start.getUTCDay())
      end.setUTCDate(end.getUTCDate() - 1 - end.getUTCDay())
      break
    case 'month-so-far':
      start.setUTCDate(1)
      break
    case 'last-month':
      start.setUTCMonth(start.getUTCMonth() - 1, 1)
      end.setUTCDate(0)
      break
    case 'this-month':
      start.setUTCDate(1)
      end.setUTCMonth(end.getUTCMonth() + 1, 0)
      break
    case 'last-30-days':
      start.setUTCDate(start.getUTCDate() - 29)
      break
    case 'last-90-days':
      start.setUTCDate(start.getUTCDate() - 89)
      break
    case 'this-quarter':
      start.setUTCMonth(Math.floor(start.getUTCMonth() / 3) * 3, 1)
      end.setUTCMonth(Math.floor(end.getUTCMonth() / 3) * 3 + 3, 0)
      break
    case 'last-quarter':
      start.setUTCMonth(Math.floor(start.getUTCMonth() / 3) * 3 - 3, 1)
      end.setUTCMonth(Math.floor(end.getUTCMonth() / 3) * 3, 0)
      break
    case 'this-year':
      start.setUTCMonth(9, 2)
      end.setUTCMonth(9, 2)
      break
    case 'last-year':
      start.setUTCFullYear(start.getUTCFullYear() - 1, 0, 1)
      end.setUTCFullYear(end.getUTCFullYear() - 1, 11, 31)
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
  limit: z.number().optional(),
  starting_after: z.string().optional(),
})

export const FetchRefundsSchema = z.object({
  range: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  limit: z.number().optional(),
  starting_after: z.string().optional(),
})

export interface PaginatedCharges {
  charges: SimplifiedCharge[]
  has_more: boolean
  next_page_cursor: string | null
}

export async function fetchCharges({
  range,
  start,
  end,
  limit = 100,
  starting_after,
}: z.infer<typeof FetchChargesSchema>): Promise<PaginatedCharges> {
  let startDate: Date
  let endDate: Date

  if (start && end) {
    startDate = new Date(start)
    endDate = new Date(end)
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

  console.log(
    `Fetching charges for ${startDate.toISOString()} to ${endDate.toISOString()}`,
  )

  const charges: Stripe.ApiList<Stripe.Charge> = await fetchChargesWithRetry({
    created: {
      gte: Math.floor(startDate.getTime() / 1000),
      lte: Math.floor(endDate.getTime() / 1000),
    },
    expand: ['data.balance_transaction'],
    limit,
    ...(starting_after ? {starting_after} : {}),
  })

  console.log(`Fetched ${charges.data.length} charges`)

  const simplifiedCharges = charges.data
    .filter((charge) => charge.status === 'succeeded')
    .map(simplifyCharge)

  console.log(
    `Fetched ${
      simplifiedCharges.length
    } succeeded charges for ${startDate.toISOString()} to ${endDate.toISOString()}`,
  )

  return {
    charges: simplifiedCharges,
    has_more: charges.has_more,
    next_page_cursor: charges.data[charges.data.length - 1]?.id || null,
  }
}

export interface PaginatedRefunds {
  refunds: SimplifiedRefund[]
  has_more: boolean
  next_page_cursor: string | null
}

export async function fetchRefunds({
  range,
  start,
  end,
  limit = 100,
  starting_after,
}: z.infer<typeof FetchRefundsSchema>): Promise<PaginatedRefunds> {
  let startDate: Date
  let endDate: Date

  if (start && end) {
    startDate = new Date(start)
    endDate = new Date(end)
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

  console.log(
    `Fetching refunds for ${startDate.toISOString()} to ${endDate.toISOString()}`,
  )

  const refunds: Stripe.ApiList<Stripe.Refund> = await fetchRefundsWithRetry({
    created: {
      gte: Math.floor(startDate.getTime() / 1000),
      lte: Math.floor(endDate.getTime() / 1000),
    },
    expand: ['data.charge'],
    limit,
    ...(starting_after ? {starting_after} : {}),
  })

  console.log(`Fetched ${refunds.data.length} refunds`)

  const simplifiedRefunds = refunds.data.map(simplifyRefund)

  return {
    refunds: simplifiedRefunds,
    has_more: refunds.has_more,
    next_page_cursor: refunds.data.length
      ? refunds.data[refunds.data.length - 1].id
      : null,
  }
}

export const SimplifiedBalanceTransactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  net: z.number(),
  fee: z.number(),
  currency: z.string(),
  type: z.string(),
  created: z.number(),
  available_on: z.number(),
  status: z.string(),
  description: z.string().nullable(),
  source: z.string().nullable(), // Add this line
})

export type SimplifiedBalanceTransaction = z.infer<
  typeof SimplifiedBalanceTransactionSchema
>

// Update the simplifyBalanceTransaction function
function simplifyBalanceTransaction(
  transaction: Stripe.BalanceTransaction,
): SimplifiedBalanceTransaction {
  return SimplifiedBalanceTransactionSchema.parse({
    id: transaction.id,
    amount: transaction.amount,
    net: transaction.net,
    fee: transaction.fee,
    currency: transaction.currency,
    type: transaction.type,
    created: transaction.created,
    available_on: transaction.available_on,
    status: transaction.status,
    description: transaction.description,
    source: transaction.source, // Add this line
  })
}

async function fetchBalanceTransactionsWithRetry(
  params: Stripe.BalanceTransactionListParams,
  maxRetries = 3,
): Promise<Stripe.ApiList<Stripe.BalanceTransaction>> {
  let retries = 0
  while (retries < maxRetries) {
    try {
      console.log(
        `Fetching balance transactions with params: ${JSON.stringify(params)}`,
      )
      return await stripe.balanceTransactions.list(params)
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
  throw new Error('Max retries reached when fetching balance transactions')
}

export const FetchBalanceTransactionsSchema = z.object({
  range: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  limit: z.number().optional(),
  starting_after: z.string().optional(),
})

export interface PaginatedBalanceTransactions {
  transactions: SimplifiedBalanceTransaction[]
  has_more: boolean
  next_page_cursor: string | null
}

export async function fetchBalanceTransactions({
  range,
  start,
  end,
  limit = 100,
  starting_after,
}: z.infer<
  typeof FetchBalanceTransactionsSchema
>): Promise<PaginatedBalanceTransactions> {
  let startDate: Date
  let endDate: Date

  if (start && end) {
    startDate = new Date(start)
    endDate = new Date(end)
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

  console.log(
    `Fetching balance transactions for ${startDate.toISOString()} to ${endDate.toISOString()}`,
  )

  const transactions: Stripe.ApiList<Stripe.BalanceTransaction> =
    await fetchBalanceTransactionsWithRetry({
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lte: Math.floor(endDate.getTime() / 1000),
      },
      limit,
      ...(starting_after ? {starting_after} : {}),
    })

  console.log(`Fetched ${transactions.data.length} balance transactions`)

  const simplifiedTransactions = transactions.data.map(
    simplifyBalanceTransaction,
  )

  return {
    transactions: simplifiedTransactions,
    has_more: transactions.has_more,
    next_page_cursor:
      transactions.data[transactions.data.length - 1]?.id || null,
  }
}

// enricnhes?

// Update the EnrichedBalanceTransactionSchema
export const EnrichedBalanceTransactionSchema =
  SimplifiedBalanceTransactionSchema.extend({
    productId: z.string().nullable(),
    product: z.string().nullable(),
    siteName: z.string().nullable(),
    chargeId: z.string().nullable(),
    amountRefunded: z.number().nullable(),
  })

export type EnrichedBalanceTransaction = z.infer<
  typeof EnrichedBalanceTransactionSchema
>

export interface PaginatedEnrichedBalanceTransactions {
  transactions: EnrichedBalanceTransaction[]
  has_more: boolean
  next_page_cursor: string | null
}

export async function fetchEnrichedBalanceTransactions({
  range,
  start,
  end,
  limit = 100,
  starting_after,
}: z.infer<
  typeof FetchBalanceTransactionsSchema
>): Promise<PaginatedEnrichedBalanceTransactions> {
  console.log('Fetching enriched balance transactions...')

  try {
    // Fetch balance transactions with pagination
    const balanceTransactionsResult = await fetchBalanceTransactions({
      range,
      start,
      end,
      limit,
      starting_after,
    })

    // Get unique charge and refund IDs from the current page of balance transactions
    const chargeIds = new Set<string>()
    const refundIds = new Set<string>()

    balanceTransactionsResult.transactions.forEach((transaction) => {
      if (transaction.type === 'charge' || transaction.type === 'payment') {
        if (transaction.source) chargeIds.add(transaction.source)
      } else if (transaction.type === 'refund') {
        if (transaction.source) refundIds.add(transaction.source)
      }
    })

    // Fetch charges and refunds for the current page
    const [charges, refunds] = await Promise.all([
      Promise.all(
        Array.from(chargeIds).map((id) => stripe.charges.retrieve(id)),
      ),
      Promise.all(
        Array.from(refundIds).map((id) => stripe.refunds.retrieve(id)),
      ),
    ])

    // Create maps for quick lookup
    const chargeMap = new Map(
      charges.map((charge) => [charge.id, simplifyCharge(charge)]),
    )
    const refundMap = new Map(
      refunds.map((refund) => [refund.id, simplifyRefund(refund)]),
    )

    // Fetch associated charges for refunds
    const refundCharges = await Promise.all(
      refunds.map((refund) =>
        refund.charge && typeof refund.charge === 'string'
          ? stripe.charges.retrieve(refund.charge)
          : null,
      ),
    )

    // Update refundMap with charge information
    refunds.forEach((refund, index) => {
      const charge = refundCharges[index]
      if (charge) {
        const updatedRefund = simplifyRefund({
          ...refund,
          charge: charge as Stripe.Charge,
        })
        refundMap.set(refund.id, updatedRefund)
      }
    })

    // Enrich balance transactions with charge and refund data
    const enrichedTransactions = balanceTransactionsResult.transactions.map(
      (transaction): EnrichedBalanceTransaction => {
        if (
          (transaction.type === 'charge' || transaction.type === 'payment') &&
          transaction.source
        ) {
          const charge = chargeMap.get(transaction.source)
          return EnrichedBalanceTransactionSchema.parse({
            ...transaction,
            productId: charge?.productId || null,
            product: charge?.product || null,
            siteName: charge?.siteName || null,
            chargeId: charge?.id || null,
            amountRefunded: charge?.amountRefunded || null,
          })
        } else if (transaction.type === 'refund' && transaction.source) {
          const refund = refundMap.get(transaction.source)
          return EnrichedBalanceTransactionSchema.parse({
            ...transaction,
            productId: refund?.productId || null,
            product: refund?.product || null,
            siteName: null, // Refunds don't have siteName in your current setup
            chargeId: refund?.chargeId || null,
            amountRefunded: refund?.amount || null,
          })
        }

        return EnrichedBalanceTransactionSchema.parse({
          ...transaction,
          productId: null,
          product: null,
          siteName: null,
          chargeId: null,
          amountRefunded: null,
        })
      },
    )

    console.log(`Enriched ${enrichedTransactions.length} transactions`)

    return {
      transactions: enrichedTransactions,
      has_more: balanceTransactionsResult.has_more,
      next_page_cursor: balanceTransactionsResult.next_page_cursor,
    }
  } catch (error) {
    console.error('Error fetching enriched balance transactions:', error)
    throw error // Re-throw the error for the caller to handle
  }
}
