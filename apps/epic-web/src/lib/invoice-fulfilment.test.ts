import {
  fulfilInvoice,
  type FulfilDeps,
  type FulfilledPurchase,
  type PaidInvoice,
  planInvoiceFulfilment,
} from 'lib/invoice-fulfilment'

const PRACTICAL_TS = {
  id: 'mp_practical_ts',
  productId: 'e2f18c94-012f-45b5-8962-4d5f320b510f',
  merchantAccountId: 'kcd_account',
}

const epicWebProducts: Record<string, typeof PRACTICAL_TS> = {
  prod_U0GJrLA2D0iUA3: PRACTICAL_TS,
}

const planDeps = {
  findEpicWebMerchantProduct: async (stripeProductId: string) =>
    epicWebProducts[stripeProductId] ?? null,
}

function invoice(overrides: Partial<PaidInvoice> = {}): PaidInvoice {
  return {
    id: 'in_team_order',
    status: 'paid',
    subscription: null,
    billing_reason: 'manual',
    customer: 'cus_team_buyer',
    customer_email: 'buyer@example.com',
    customer_name: 'Buyer',
    charge: 'ch_team_order',
    amount_paid: 68000,
    currency: 'usd',
    lines: {
      data: [
        {
          quantity: 17,
          subscription: null,
          price: {product: 'prod_U0GJrLA2D0iUA3', recurring: null},
        },
      ],
      has_more: false,
    },
    ...overrides,
  }
}

// An in-memory stand-in for kcd-products with the same idempotency key the
// real createMerchantChargeAndPurchase uses (one purchase per charge).
function fakeStore() {
  const purchases: (FulfilledPurchase & {
    chargeId: string
    sessionId: string
    seats: number
  })[] = []
  const users = new Map<string, {id: string; email: string}>()
  const deps: FulfilDeps = {
    findPurchaseForInvoice: async ({invoiceId, chargeId}) =>
      purchases.find(
        (p) => p.chargeId === chargeId || p.sessionId === invoiceId,
      ) ?? null,
    findOrCreateUser: async (email) => {
      const user = users.get(email) ?? {id: `user_${users.size + 1}`, email}
      users.set(email, user)
      return {user}
    },
    findOrCreateMerchantCustomer: async ({identifier}) => ({
      id: `mc_${identifier}`,
    }),
    createMerchantChargeAndPurchase: jest.fn(async (args) => {
      if (purchases.some((p) => p.chargeId === args.stripeChargeId)) {
        throw new Error('Unique constraint failed on MerchantCharge.identifier')
      }
      const purchase = {
        id: `purchase_${purchases.length + 1}`,
        userId: args.userId,
        productId: args.productId,
        bulkCouponId:
          args.bulk || args.quantity > 1
            ? `coupon_${purchases.length + 1}`
            : null,
        chargeId: args.stripeChargeId,
        sessionId: args.checkoutSessionId,
        seats: args.quantity,
      }
      purchases.push(purchase)
      return purchase
    }),
  }
  return {purchases, deps}
}

async function handle(inv: PaidInvoice, deps: FulfilDeps) {
  const plan = await planInvoiceFulfilment(inv, planDeps)
  if (plan.kind !== 'fulfil') return plan
  return fulfilInvoice(plan, deps)
}

describe('invoice fulfilment', () => {
  test('a multi-seat invoice creates one bulk purchase with a seat per unit', async () => {
    const {purchases, deps} = fakeStore()
    const result = await handle(invoice(), deps)

    expect(result).toMatchObject({created: true})
    expect(purchases).toHaveLength(1)
    expect(purchases[0]).toMatchObject({
      productId: PRACTICAL_TS.productId,
      chargeId: 'ch_team_order',
      sessionId: 'in_team_order',
      seats: 17,
    })
    expect(purchases[0].bulkCouponId).not.toBeNull()
    expect(deps.createMerchantChargeAndPurchase).toHaveBeenCalledWith(
      expect.objectContaining({
        bulk: true,
        quantity: 17,
        stripeChargeAmount: 68000,
        merchantProductId: PRACTICAL_TS.id,
        merchantCustomerId: 'mc_cus_team_buyer',
      }),
    )
  })

  test('quantity is summed across lines for the same product', async () => {
    const {purchases, deps} = fakeStore()
    const line = invoice().lines.data[0]
    await handle(
      invoice({
        lines: {
          data: [
            {...line, quantity: 10},
            {...line, quantity: 7},
          ],
        },
      }),
      deps,
    )
    expect(purchases).toHaveLength(1)
    expect(purchases[0].seats).toBe(17)
  })

  test('invoice.payment_succeeded then invoice.paid for one invoice gives one purchase', async () => {
    const {purchases, deps} = fakeStore()
    const first = await handle(invoice(), deps)
    const replay = await handle(invoice(), deps)

    expect(first).toMatchObject({created: true})
    expect(replay).toMatchObject({created: false})
    expect(purchases).toHaveLength(1)
    expect(deps.createMerchantChargeAndPurchase).toHaveBeenCalledTimes(1)
  })

  test('a purchase already recorded for the charge is not duplicated', async () => {
    const {purchases, deps} = fakeStore()
    await handle(invoice(), deps)
    // Same charge, different invoice id: still the same payment.
    const again = await handle(invoice({id: 'in_other'}), deps)
    expect(again).toMatchObject({created: false})
    expect(purchases).toHaveLength(1)
  })

  test('a non-Epic Web invoice is ignored', async () => {
    const plan = await planInvoiceFulfilment(
      invoice({
        lines: {
          data: [
            {
              quantity: 5,
              subscription: null,
              price: {product: 'prod_epic_ai_thing', recurring: null},
            },
          ],
        },
      }),
      planDeps,
    )
    expect(plan).toMatchObject({kind: 'ignore'})
  })

  test('a subscription invoice is ignored', async () => {
    const bySubscription = await planInvoiceFulfilment(
      invoice({subscription: 'sub_123'}),
      planDeps,
    )
    const byReason = await planInvoiceFulfilment(
      invoice({billing_reason: 'subscription_cycle'}),
      planDeps,
    )
    expect(bySubscription).toMatchObject({kind: 'ignore'})
    expect(byReason).toMatchObject({kind: 'ignore'})
  })

  test('an unpaid invoice is ignored', async () => {
    const plan = await planInvoiceFulfilment(
      invoice({status: 'open'}),
      planDeps,
    )
    expect(plan).toMatchObject({kind: 'ignore'})
  })

  test('zero quantity is refused', async () => {
    const line = invoice().lines.data[0]
    const plan = await planInvoiceFulfilment(
      invoice({lines: {data: [{...line, quantity: 0}]}}),
      planDeps,
    )
    expect(plan).toMatchObject({kind: 'refuse'})
  })

  test('an Epic Web product next to an unknown product is refused', async () => {
    const line = invoice().lines.data[0]
    const plan = await planInvoiceFulfilment(
      invoice({
        lines: {
          data: [
            line,
            {...line, price: {product: 'prod_unknown', recurring: null}},
          ],
        },
      }),
      planDeps,
    )
    expect(plan).toMatchObject({kind: 'refuse'})
  })

  test('two different Epic Web products on one invoice are refused', async () => {
    const line = invoice().lines.data[0]
    const plan = await planInvoiceFulfilment(
      invoice({
        lines: {
          data: [
            line,
            {...line, price: {product: 'prod_other_epic', recurring: null}},
          ],
        },
      }),
      {
        findEpicWebMerchantProduct: async (id) =>
          id === 'prod_other_epic'
            ? {...PRACTICAL_TS, id: 'mp_other', productId: 'other'}
            : planDeps.findEpicWebMerchantProduct(id),
      },
    )
    expect(plan).toMatchObject({kind: 'refuse'})
  })

  test('a paid invoice without a charge is refused', async () => {
    const plan = await planInvoiceFulfilment(invoice({charge: null}), planDeps)
    expect(plan).toMatchObject({kind: 'refuse'})
  })
})
