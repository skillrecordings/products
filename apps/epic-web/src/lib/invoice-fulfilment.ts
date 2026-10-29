import {z} from 'zod'

/**
 * Fulfilment for paid one-off Stripe invoices (team orders sold by invoice
 * instead of checkout). A paid invoice gets the records a bulk checkout would
 * create: MerchantCustomer, MerchantCharge, MerchantSession, a bulk Purchase
 * and a bulk Coupon with maxUses = quantity.
 *
 * The KCD Stripe account also sends invoice events to other sites (Epic AI,
 * Epic Product Engineer) and kcd-products holds Epic React and Testing
 * JavaScript products, so an invoice is only fulfilled when every line is an
 * Epic Web product. Anything ambiguous is refused, never guessed.
 */

export const PaidInvoiceSchema = z.object({
  id: z.string(),
  status: z.string().nullable(),
  subscription: z.unknown().nullable().optional(),
  billing_reason: z.string().nullable().optional(),
  customer: z.union([z.string(), z.object({id: z.string()})]).nullable(),
  customer_email: z.string().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  charge: z
    .union([z.string(), z.object({id: z.string()})])
    .nullable()
    .optional(),
  amount_paid: z.number(),
  currency: z.string(),
  lines: z.object({
    data: z.array(
      z.object({
        quantity: z.number().nullable(),
        subscription: z.unknown().nullable().optional(),
        price: z
          .object({
            product: z.union([z.string(), z.object({id: z.string()})]),
            recurring: z.unknown().nullable().optional(),
          })
          .nullable()
          .optional(),
      }),
    ),
    has_more: z.boolean().optional(),
  }),
})

export type PaidInvoice = z.infer<typeof PaidInvoiceSchema>

export type EpicWebMerchantProduct = {
  id: string
  productId: string
  merchantAccountId: string
}

export type InvoiceFulfilmentPlan =
  | {kind: 'ignore'; invoiceId: string; reason: string}
  | {kind: 'refuse'; invoiceId: string; reason: string}
  | {
      kind: 'fulfil'
      invoiceId: string
      chargeId: string
      customerId: string
      email: string
      name: string | null
      stripeProductId: string
      merchantProduct: EpicWebMerchantProduct
      quantity: number
      amountPaid: number
    }

export type PlanDeps = {
  /**
   * Returns the MerchantProduct for a Stripe product id when it is an Epic
   * Web product, or null when it isn't one of ours.
   */
  findEpicWebMerchantProduct: (
    stripeProductId: string,
  ) => Promise<EpicWebMerchantProduct | null>
}

const idOf = (value: string | {id: string} | null | undefined) =>
  typeof value === 'string' ? value : value?.id ?? null

export async function planInvoiceFulfilment(
  invoice: PaidInvoice,
  deps: PlanDeps,
): Promise<InvoiceFulfilmentPlan> {
  const invoiceId = invoice.id
  const ignore = (reason: string) => ({
    kind: 'ignore' as const,
    invoiceId,
    reason,
  })
  const refuse = (reason: string) => ({
    kind: 'refuse' as const,
    invoiceId,
    reason,
  })

  if (
    invoice.subscription ||
    invoice.billing_reason?.startsWith('subscription')
  ) {
    return ignore('subscription invoice')
  }
  if (invoice.status !== 'paid') {
    return ignore(`invoice status is ${invoice.status}`)
  }

  const lines = await Promise.all(
    invoice.lines.data.map(async (line) => {
      const stripeProductId = idOf(line.price?.product)
      const merchantProduct = stripeProductId
        ? await deps.findEpicWebMerchantProduct(stripeProductId)
        : null
      return {line, stripeProductId, merchantProduct}
    }),
  )

  const epicWebLines = lines.filter((l) => l.merchantProduct)
  if (epicWebLines.length === 0) {
    return ignore('no Epic Web products on invoice')
  }

  // From here the invoice is at least partly ours, so problems are refusals.
  if (invoice.lines.has_more) {
    return refuse('invoice has more lines than were loaded')
  }
  if (epicWebLines.length !== lines.length) {
    return refuse('invoice mixes Epic Web and unknown products')
  }
  if (lines.some((l) => l.line.subscription || l.line.price?.recurring)) {
    return refuse('invoice has recurring lines')
  }
  const stripeProductIds = Array.from(
    new Set(lines.map((l) => l.stripeProductId)),
  )
  if (stripeProductIds.length !== 1) {
    // One charge backs exactly one Purchase, so a multi-product invoice
    // needs a person to decide how to split it.
    return refuse(
      `invoice has ${stripeProductIds.length} different products, expected 1`,
    )
  }
  if (lines.some((l) => !l.line.quantity || l.line.quantity < 1)) {
    return refuse('invoice has a line with zero quantity')
  }

  const chargeId = idOf(invoice.charge)
  if (!chargeId) return refuse('paid invoice has no charge')
  const customerId = idOf(invoice.customer)
  if (!customerId) return refuse('invoice has no customer')
  if (!invoice.customer_email) return refuse('invoice has no customer email')

  return {
    kind: 'fulfil',
    invoiceId,
    chargeId,
    customerId,
    email: invoice.customer_email,
    name: invoice.customer_name ?? null,
    stripeProductId: stripeProductIds[0] as string,
    merchantProduct: epicWebLines[0].merchantProduct as EpicWebMerchantProduct,
    quantity: lines.reduce((sum, l) => sum + (l.line.quantity ?? 0), 0),
    amountPaid: invoice.amount_paid,
  }
}

export type FulfilledPurchase = {
  id: string
  userId: string | null
  productId: string
  bulkCouponId: string | null
}

export type FulfilDeps = {
  /** A purchase already recorded for this invoice or its charge. */
  findPurchaseForInvoice: (args: {
    invoiceId: string
    chargeId: string
  }) => Promise<FulfilledPurchase | null>
  findOrCreateUser: (
    email: string,
    name?: string | null,
  ) => Promise<{user: {id: string; email: string | null}}>
  findOrCreateMerchantCustomer: (args: {
    user: any
    identifier: string
    merchantAccountId: string
  }) => Promise<{id: string}>
  createMerchantChargeAndPurchase: (args: {
    userId: string
    productId: string
    stripeChargeId: string
    merchantAccountId: string
    merchantProductId: string
    merchantCustomerId: string
    stripeChargeAmount: number
    quantity: number
    bulk: boolean
    checkoutSessionId: string
    appliedPPPStripeCouponId: undefined
    upgradedFromPurchaseId: undefined
    usedCouponId: undefined
  }) => Promise<FulfilledPurchase>
}

export async function fulfilInvoice(
  plan: Extract<InvoiceFulfilmentPlan, {kind: 'fulfil'}>,
  deps: FulfilDeps,
): Promise<{purchase: FulfilledPurchase; created: boolean}> {
  const existing = await deps.findPurchaseForInvoice({
    invoiceId: plan.invoiceId,
    chargeId: plan.chargeId,
  })
  if (existing) return {purchase: existing, created: false}

  const {user} = await deps.findOrCreateUser(plan.email, plan.name)
  const merchantCustomer = await deps.findOrCreateMerchantCustomer({
    user,
    identifier: plan.customerId,
    merchantAccountId: plan.merchantProduct.merchantAccountId,
  })

  // The invoice id stands in for the checkout session id, so the
  // MerchantSession ties the purchase back to the invoice.
  const purchase = await deps.createMerchantChargeAndPurchase({
    userId: user.id,
    productId: plan.merchantProduct.productId,
    stripeChargeId: plan.chargeId,
    merchantAccountId: plan.merchantProduct.merchantAccountId,
    merchantProductId: plan.merchantProduct.id,
    merchantCustomerId: merchantCustomer.id,
    stripeChargeAmount: plan.amountPaid,
    quantity: plan.quantity,
    bulk: true,
    checkoutSessionId: plan.invoiceId,
    appliedPPPStripeCouponId: undefined,
    upgradedFromPurchaseId: undefined,
    usedCouponId: undefined,
  })

  return {purchase, created: true}
}
