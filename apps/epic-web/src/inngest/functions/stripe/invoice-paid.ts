import {inngest} from 'inngest/inngest.server'
import {
  NEW_PURCHASE_CREATED_EVENT,
  STRIPE_CHECKOUT_COMPLETED_EVENT,
  STRIPE_WEBHOOK_RECEIVED_EVENT,
} from '@skillrecordings/inngest'
import {getSdk, prisma} from '@skillrecordings/database'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {NonRetriableError} from 'inngest'
import groq from 'groq'
import {paymentOptions} from 'pages/api/skill/[...skillRecordings]'
import {
  decideInvoiceOwnership,
  fulfilInvoice,
  INVOICE_CUTOVER_ENV,
  InvoiceOwnershipError,
  PaidInvoiceSchema,
  planInvoiceFulfilment,
} from 'lib/invoice-fulfilment'

const stripe = paymentOptions.providers.stripe?.paymentClient

/**
 * Fulfils a paid one-off invoice the way a bulk checkout would: a bulk
 * purchase with a coupon for every seat, then the usual post-purchase events
 * (team welcome email, Discord, bundles).
 *
 * Stripe sends both invoice.paid and invoice.payment_succeeded for the same
 * payment, so runs are keyed on the invoice id, and fulfilInvoice checks for
 * an existing purchase before writing anything.
 *
 * While Course Builder also receives these events, an invoice paid at or
 * after EPIC_WEB_INVOICE_CUTOVER_AT is Course Builder's and is ignored here
 * (see decideInvoiceOwnership). Unset, every invoice is fulfilled here.
 */
export const stripeInvoicePaid = inngest.createFunction(
  {
    id: 'stripe-invoice-paid',
    name: 'Stripe Invoice Paid - Fulfil',
    idempotency: 'event.data.data.object.id',
    concurrency: {key: 'event.data.data.object.id', limit: 1},
  },
  {
    event: STRIPE_WEBHOOK_RECEIVED_EVENT,
    if: `event.data.type == 'invoice.paid' || event.data.type == 'invoice.payment_succeeded'`,
  },
  async ({event, step}) => {
    if (!stripe) {
      throw new NonRetriableError('Payment provider (Stripe) is missing')
    }

    const invoice = await step.run('load invoice', async () => {
      return PaidInvoiceSchema.parse(
        await stripe.invoices.retrieve(event.data.data.object.id),
      )
    })

    // Decided once per run (a step result is memoized), so a variable
    // changed mid-run cannot flip the answer after a purchase is written.
    const ownership = await step.run('decide owner', async () => {
      try {
        return decideInvoiceOwnership(invoice, process.env[INVOICE_CUTOVER_ENV])
      } catch (error) {
        if (error instanceof InvoiceOwnershipError) {
          console.error(error.message)
          // A paid invoice without paid_at won't change on retry (the
          // invoice above is memoized); a bad variable might be fixed, so
          // that one is left to Inngest's retries and then fails visibly.
          if (error.code === 'paid-at-missing') {
            throw new NonRetriableError(error.message)
          }
        }
        throw error
      }
    })

    if (ownership.kind === 'ignore') {
      console.info(
        `invoice ${ownership.invoiceId} ignored: ${ownership.reason} (paid ${ownership.paidAt}, cutover ${ownership.cutoverAt})`,
      )
      return ownership
    }

    const plan = await step.run('plan fulfilment', async () => {
      return planInvoiceFulfilment(invoice, {
        findEpicWebMerchantProduct: async (stripeProductId) => {
          const merchantProduct = await prisma.merchantProduct.findFirst({
            where: {identifier: stripeProductId, status: 1},
            select: {id: true, productId: true, merchantAccountId: true},
          })
          if (!merchantProduct) return null
          // kcd-products also holds Epic React and Testing JavaScript
          // products; only the ones in Epic Web's catalog are ours.
          const inEpicWebCatalog = await sanityClient.fetch(
            groq`count(*[_type == "product" && productId == $productId]) > 0`,
            {productId: merchantProduct.productId},
          )
          return inEpicWebCatalog ? merchantProduct : null
        },
      })
    })

    if (plan.kind === 'ignore') {
      return plan
    }

    if (plan.kind === 'refuse') {
      console.error(`invoice ${plan.invoiceId} not fulfilled: ${plan.reason}`)
      throw new NonRetriableError(
        `invoice ${plan.invoiceId} not fulfilled: ${plan.reason}`,
      )
    }

    const {purchase, created} = await step.run('record purchase', async () => {
      const sdk = getSdk()
      return fulfilInvoice(plan, {
        findPurchaseForInvoice: ({invoiceId, chargeId}) =>
          prisma.purchase.findFirst({
            where: {
              OR: [
                {merchantCharge: {identifier: chargeId}},
                {merchantSession: {identifier: invoiceId}},
              ],
            },
          }),
        findOrCreateUser: sdk.findOrCreateUser,
        findOrCreateMerchantCustomer: sdk.findOrCreateMerchantCustomer,
        createMerchantChargeAndPurchase: sdk.createMerchantChargeAndPurchase,
      })
    })

    if (!created) {
      return {invoiceId: plan.invoiceId, purchaseId: purchase.id, created}
    }

    const user = await step.run('load user', async () => {
      return prisma.user.findUniqueOrThrow({where: {id: purchase.userId!}})
    })

    // The same events checkout sends, with ids keyed on the invoice so a
    // retried step can't send the welcome email twice.
    await step.sendEvent('announce purchase', [
      {
        id: `invoice-new-purchase-${plan.invoiceId}`,
        name: NEW_PURCHASE_CREATED_EVENT,
        data: {
          purchaseId: purchase.id,
          checkoutSessionId: plan.invoiceId,
          productId: purchase.productId,
        },
        user,
      },
      {
        id: `invoice-checkout-completed-${plan.invoiceId}`,
        name: STRIPE_CHECKOUT_COMPLETED_EVENT,
        data: {
          purchaseId: purchase.id,
          quantity: plan.quantity,
          productId: purchase.productId,
          created: Date.now(),
        },
        user,
      },
    ])

    return {
      invoiceId: plan.invoiceId,
      purchaseId: purchase.id,
      bulkCouponId: purchase.bulkCouponId,
      quantity: plan.quantity,
      created,
    }
  },
)
