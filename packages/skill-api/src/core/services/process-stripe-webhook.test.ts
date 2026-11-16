import {
  isCourseBuilderCheckoutSession,
  processStripeWebhook,
  receiveInternalStripeWebhooks,
  receiveStripeWebhooks,
} from './process-stripe-webhook'
import {recordNewPurchase} from '@skillrecordings/commerce-server'

jest.mock('@skillrecordings/database', () => ({
  getSdk: () => ({
    updatePurchaseStatusForCharge: jest.fn(),
    findOrCreateUser: jest.fn(),
    transferPurchasesToNewUser: jest.fn(),
  }),
  prisma: {},
}))
jest.mock('@skillrecordings/commerce-server', () => ({
  recordNewPurchase: jest.fn(async () => ({
    user: {id: 'user-1', email: 'buyer@example.com'},
    purchase: {id: 'purchase-1', productId: 'product-1', createdAt: new Date()},
    purchaseInfo: {quantity: 1},
  })),
  NO_ASSOCIATED_PRODUCT: 'no-associated-product',
  StripeProvider: jest.fn(),
  defaultPaymentOptions: jest.fn(),
}))
jest.mock('@skillrecordings/stripe-sdk', () => ({
  defaultContext: {stripe: {}},
}))
jest.mock('../../server', () => ({
  postSaleToSlack: jest.fn(),
  sendServerEmail: jest.fn(),
}))
jest.mock('./convertkit', () => ({convertkitTagPurchase: jest.fn()}))
jest.mock('micro', () => ({buffer: jest.fn(async () => Buffer.from('{}'))}))
jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
  Headers: jest.fn(),
}))

const COURSE_BUILDER_METADATA = {
  siteName: 'epic-web',
  cbPricingContract: '2026-11-01',
  productId: 'product-1',
}
const LEGACY_METADATA = {siteName: 'epic-web', productId: 'product-1'}

const checkoutCompleted = (metadata: Record<string, string> | null) => ({
  id: 'evt_1',
  type: 'checkout.session.completed',
  data: {object: {id: 'cs_test_1', object: 'checkout.session', metadata}},
})

const paymentOptions = {
  providers: {
    stripe: {
      paymentClient: {
        webhooks: {constructEvent: jest.fn()},
      },
    },
  },
} as any

const options = {nextAuthOptions: undefined as any, paymentOptions}

const ORIGINAL_ENV = process.env

beforeEach(() => {
  jest.clearAllMocks()
  process.env = {...ORIGINAL_ENV}
  delete process.env.SKIP_COURSE_BUILDER_CHECKOUT_SESSIONS
  delete process.env.INNGEST_EVENT_KEY
  process.env.SLACK_ANNOUNCE_CHANNEL_ID = ''
  process.env.SKIP_CK_TAGGING = 'true'
  process.env.NEXT_PUBLIC_APP_NAME = 'epic-web'
})

afterAll(() => {
  process.env = ORIGINAL_ENV
})

describe('isCourseBuilderCheckoutSession', () => {
  it('is false while the variable is unset, even for a marked session', () => {
    expect(
      isCourseBuilderCheckoutSession({metadata: COURSE_BUILDER_METADATA}),
    ).toBe(false)
  })

  it('is false for any value other than the string "true"', () => {
    process.env.SKIP_COURSE_BUILDER_CHECKOUT_SESSIONS = '1'
    expect(
      isCourseBuilderCheckoutSession({metadata: COURSE_BUILDER_METADATA}),
    ).toBe(false)
  })

  it('is true for a marked session when enabled', () => {
    process.env.SKIP_COURSE_BUILDER_CHECKOUT_SESSIONS = 'true'
    expect(
      isCourseBuilderCheckoutSession({metadata: COURSE_BUILDER_METADATA}),
    ).toBe(true)
  })

  it('is false for unmarked, empty-marker or metadata-less sessions', () => {
    process.env.SKIP_COURSE_BUILDER_CHECKOUT_SESSIONS = 'true'
    expect(isCourseBuilderCheckoutSession({metadata: LEGACY_METADATA})).toBe(
      false,
    )
    expect(
      isCourseBuilderCheckoutSession({
        metadata: {...LEGACY_METADATA, cbPricingContract: ''},
      }),
    ).toBe(false)
    expect(isCourseBuilderCheckoutSession({metadata: null})).toBe(false)
    expect(isCourseBuilderCheckoutSession({})).toBe(false)
  })
})

describe('processStripeWebhook', () => {
  it('skips a Course Builder session when enabled, recording nothing', async () => {
    process.env.SKIP_COURSE_BUILDER_CHECKOUT_SESSIONS = 'true'
    const result = await processStripeWebhook(
      checkoutCompleted(COURSE_BUILDER_METADATA),
      options,
    )
    expect(result).toEqual({
      status: 200,
      body: 'not handled: course-builder session',
    })
    expect(recordNewPurchase).not.toHaveBeenCalled()
  })

  it('still records a legacy session when enabled', async () => {
    process.env.SKIP_COURSE_BUILDER_CHECKOUT_SESSIONS = 'true'
    const result = await processStripeWebhook(
      checkoutCompleted(LEGACY_METADATA),
      options,
    )
    expect(result).toEqual({status: 200, body: 'success!'})
    expect(recordNewPurchase).toHaveBeenCalledTimes(1)
    expect(recordNewPurchase).toHaveBeenCalledWith('cs_test_1', {
      paymentProvider: paymentOptions.providers.stripe,
    })
  })

  it('is inert while the variable is unset: a marked session records', async () => {
    const result = await processStripeWebhook(
      checkoutCompleted(COURSE_BUILDER_METADATA),
      options,
    )
    expect(result).toEqual({status: 200, body: 'success!'})
    expect(recordNewPurchase).toHaveBeenCalledTimes(1)
  })
})

describe('both entry points reach the skip', () => {
  it('direct Stripe endpoint: a verified Course Builder event is not recorded', async () => {
    process.env.SKIP_COURSE_BUILDER_CHECKOUT_SESSIONS = 'true'
    const event = checkoutCompleted(COURSE_BUILDER_METADATA)
    paymentOptions.providers.stripe.paymentClient.webhooks.constructEvent.mockReturnValue(
      event,
    )
    const result = await receiveStripeWebhooks({
      params: {
        req: {headers: {'stripe-signature': 'sig'}},
        rawReq: {},
        options: {nextAuthOptions: undefined},
      } as any,
      paymentOptions,
    })
    expect(result).toEqual({
      status: 200,
      body: 'not handled: course-builder session',
    })
    expect(recordNewPurchase).not.toHaveBeenCalled()
  })

  it('stripe-internal (forwarded) endpoint: a Course Builder event is not recorded', async () => {
    process.env.SKIP_COURSE_BUILDER_CHECKOUT_SESSIONS = 'true'
    process.env.SKILL_SECRET = 'internal-secret'
    const result = await receiveInternalStripeWebhooks({
      params: {
        req: {
          headers: {'x-skill-secret': 'internal-secret'},
          body: {event: checkoutCompleted(COURSE_BUILDER_METADATA)},
        },
        options: {nextAuthOptions: undefined},
      } as any,
      paymentOptions,
    })
    expect(result).toEqual({
      status: 200,
      body: 'not handled: course-builder session',
    })
    expect(recordNewPurchase).not.toHaveBeenCalled()
  })
})
