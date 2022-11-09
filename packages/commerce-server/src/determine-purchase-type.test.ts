import {determinePurchaseType} from './determine-purchase-type'

import {
  MockContext,
  Context,
  createMockContext,
} from '@skillrecordings/database'
import {User, Purchase, Coupon} from '@prisma/client'
import {Stripe} from 'stripe'
import {
  MockContext as StripeMockContext,
  createMockContext as createStripeMockContext,
} from '@skillrecordings/stripe-sdk'
import {NEW_INDIVIDUAL_PURCHASE} from '@skillrecordings/types'

let mockCtx: MockContext
let ctx: Context

let stripeMockCtx: StripeMockContext

beforeEach(() => {
  // setup database SDK mock context
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context

  // setup Stripe SDK mock context
  stripeMockCtx = createStripeMockContext()
  mockStripePurchaseInfo()
})

describe('when the user email is known', () => {
  beforeEach(() => {
    mockUser()
  })

  test('for a new individual purchase', async () => {
    mockIndividualPurchase()

    const purchaseType = await determinePurchaseType({
      checkoutSessionId: 'cs_123',
      prismaCtx: mockCtx,
      stripeCtx: stripeMockCtx,
    })

    expect(purchaseType).toBe(NEW_INDIVIDUAL_PURCHASE)
  })
})

function mockStripePurchaseInfo() {
  // Needed values: email, stripeChargeId
  const purchaseInfo = {
    customer: {email: 'customer@example.com'} as Stripe.Customer,
    line_items: {data: [{price: {product: {}}}]} as Stripe.LineItemListParams,
    payment_intent: {
      charges: [{id: 'ch_123'}] as Stripe.ChargeListParams,
    } as Stripe.PaymentIntent,
  }

  stripeMockCtx.stripe.checkout.sessions.retrieve.mockResolvedValue(
    purchaseInfo as Stripe.Response<Stripe.Checkout.Session>,
  )
}

function mockUser() {
  mockCtx.prisma.user.findUnique.mockResolvedValue({id: 'user_123'} as User)
}

function mockIndividualPurchase() {
  // mock Stripe data for:
  // const purchaseInfo = await stripeData(checkoutSessionId as string)
  // const {email, stripeChargeId} = purchaseInfo
  // no existing purchases for user
  const newPurchase = {
    id: 'purchase_123',
    bulkCoupon: null,
    redeemedBulkCouponId: null,
  } as Purchase & {bulkCoupon: Coupon | null}

  // getPurchaseForStripeCharge
  mockCtx.prisma.purchase.findFirst.mockResolvedValue(newPurchase)

  // getPurchasesForUser
  mockCtx.prisma.purchase.findMany.mockResolvedValue([newPurchase])
}
