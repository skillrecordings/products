/**
 * The ownership rule in the handler: an invoice Course Builder owns is
 * ignored right after it is loaded, before the catalog is read or anything
 * is written; unset, the handler fulfils as before.
 */
const mockRetrieve = jest.fn()
const mockFindFirstMerchantProduct = jest.fn()
const mockFindFirstPurchase = jest.fn()
const mockFindUniqueOrThrowUser = jest.fn()
const mockSanityFetch = jest.fn()
const mockSdk = {
  findOrCreateUser: jest.fn(),
  findOrCreateMerchantCustomer: jest.fn(),
  createMerchantChargeAndPurchase: jest.fn(),
}

jest.mock(
  'inngest/inngest.server',
  () => ({
    inngest: {
      createFunction: (
        _config: unknown,
        _trigger: unknown,
        handler: unknown,
      ) => ({
        handler,
      }),
    },
  }),
  // jest resolves node_modules before src, so this app-local path would hit
  // the `inngest` package; a virtual mock answers the handler's import.
  {virtual: true},
)

jest.mock('pages/api/skill/[...skillRecordings]', () => ({
  paymentOptions: {
    providers: {
      stripe: {
        paymentClient: {
          invoices: {retrieve: (...args: unknown[]) => mockRetrieve(...args)},
        },
      },
    },
  },
}))
jest.mock('@skillrecordings/database', () => ({
  prisma: {
    merchantProduct: {
      findFirst: (...args: unknown[]) => mockFindFirstMerchantProduct(...args),
    },
    purchase: {
      findFirst: (...args: unknown[]) => mockFindFirstPurchase(...args),
    },
    user: {
      findUniqueOrThrow: (...args: unknown[]) =>
        mockFindUniqueOrThrowUser(...args),
    },
  },
  getSdk: () => mockSdk,
}))
jest.mock('@skillrecordings/skill-lesson/utils/sanity-client', () => ({
  sanityClient: {fetch: (...args: unknown[]) => mockSanityFetch(...args)},
}))

import {NonRetriableError} from 'inngest'
import {stripeInvoicePaid} from './invoice-paid'

const handler = (stripeInvoicePaid as unknown as {handler: Function}).handler

const CUTOVER = '2026-12-08T15:05:00Z'
const cutoverSeconds = Date.parse(CUTOVER) / 1000

function stripeInvoice(paidAt: number | null) {
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
    status_transitions: {finalized_at: cutoverSeconds - 7200, paid_at: paidAt},
    lines: {
      data: [
        {
          quantity: 3,
          subscription: null,
          price: {product: 'prod_epic_web', recurring: null},
        },
      ],
      has_more: false,
    },
  }
}

function run() {
  const steps: string[] = []
  const step = {
    run: async (name: string, fn: () => unknown) => {
      steps.push(name)
      return fn()
    },
    sendEvent: jest.fn(async () => undefined),
  }
  const event = {
    data: {type: 'invoice.paid', data: {object: {id: 'in_team_order'}}},
  }
  return {steps, step, result: handler({event, step})}
}

const env = process.env
beforeEach(() => {
  jest.clearAllMocks()
  process.env = {...env}
  delete process.env.EPIC_WEB_INVOICE_CUTOVER_AT
  jest.spyOn(console, 'info').mockImplementation(() => undefined)
  jest.spyOn(console, 'error').mockImplementation(() => undefined)
  mockFindFirstMerchantProduct.mockResolvedValue({
    id: 'mp_epic_web',
    productId: 'product_epic_web',
    merchantAccountId: 'kcd_account',
  })
  mockSanityFetch.mockResolvedValue(true)
  mockFindFirstPurchase.mockResolvedValue(null)
  mockSdk.findOrCreateUser.mockResolvedValue({
    user: {id: 'user_buyer', email: 'buyer@example.com'},
  })
  mockSdk.findOrCreateMerchantCustomer.mockResolvedValue({id: 'mcus_1'})
  mockSdk.createMerchantChargeAndPurchase.mockResolvedValue({
    id: 'purchase_1',
    userId: 'user_buyer',
    productId: 'product_epic_web',
    bulkCouponId: 'coupon_1',
  })
  mockFindUniqueOrThrowUser.mockResolvedValue({id: 'user_buyer'})
})
afterAll(() => {
  process.env = env
})

const nothingReadOrWritten = () => {
  expect(mockFindFirstMerchantProduct).not.toHaveBeenCalled()
  expect(mockSanityFetch).not.toHaveBeenCalled()
  expect(mockFindFirstPurchase).not.toHaveBeenCalled()
  expect(mockSdk.findOrCreateUser).not.toHaveBeenCalled()
  expect(mockSdk.findOrCreateMerchantCustomer).not.toHaveBeenCalled()
  expect(mockSdk.createMerchantChargeAndPurchase).not.toHaveBeenCalled()
}

test('variable set, paid at or after the cutoff: ignored before any read or write', async () => {
  process.env.EPIC_WEB_INVOICE_CUTOVER_AT = CUTOVER
  mockRetrieve.mockResolvedValue(stripeInvoice(cutoverSeconds + 30))
  const {steps, step, result} = run()
  await expect(result).resolves.toEqual({
    kind: 'ignore',
    invoiceId: 'in_team_order',
    reason: 'owned-by-course-builder',
    paidAt: '2026-12-08T15:05:30.000Z',
    cutoverAt: '2026-12-08T15:05:00.000Z',
  })
  expect(steps).toEqual(['load invoice', 'decide owner'])
  nothingReadOrWritten()
  expect(step.sendEvent).not.toHaveBeenCalled()
})

test('variable set, paid before the cutoff: fulfilled as before', async () => {
  process.env.EPIC_WEB_INVOICE_CUTOVER_AT = CUTOVER
  mockRetrieve.mockResolvedValue(stripeInvoice(cutoverSeconds - 30))
  const {steps, step, result} = run()
  await expect(result).resolves.toMatchObject({
    invoiceId: 'in_team_order',
    purchaseId: 'purchase_1',
    created: true,
  })
  expect(steps.slice(0, 3)).toEqual([
    'load invoice',
    'decide owner',
    'plan fulfilment',
  ])
  expect(mockSdk.createMerchantChargeAndPurchase).toHaveBeenCalledTimes(1)
  expect(step.sendEvent).toHaveBeenCalledTimes(1)
})

test('variable unset: fulfilled, whenever it was paid (inert by default)', async () => {
  mockRetrieve.mockResolvedValue(stripeInvoice(cutoverSeconds + 999_999))
  const {result} = run()
  await expect(result).resolves.toMatchObject({created: true})
  expect(mockSdk.createMerchantChargeAndPurchase).toHaveBeenCalledTimes(1)
})

test('unparseable variable: the run fails, nothing read or written', async () => {
  process.env.EPIC_WEB_INVOICE_CUTOVER_AT = '2026-12-08 15:05'
  mockRetrieve.mockResolvedValue(stripeInvoice(cutoverSeconds + 30))
  const {result} = run()
  await expect(result).rejects.toThrow(
    /EPIC_WEB_INVOICE_CUTOVER_AT must be an ISO-8601 UTC timestamp/,
  )
  // retriable: a corrected variable is picked up by Inngest's retries
  await expect(result).rejects.not.toBeInstanceOf(NonRetriableError)
  nothingReadOrWritten()
})

test('paid invoice without paid_at: fails without retry, nothing read or written', async () => {
  process.env.EPIC_WEB_INVOICE_CUTOVER_AT = CUTOVER
  mockRetrieve.mockResolvedValue(stripeInvoice(null))
  const {result} = run()
  await expect(result).rejects.toBeInstanceOf(NonRetriableError)
  await expect(result).rejects.toThrow(/has no status_transitions.paid_at/)
  nothingReadOrWritten()
})
