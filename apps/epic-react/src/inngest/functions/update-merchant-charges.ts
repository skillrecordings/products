import {inngest} from '@/inngest/inngest.server'
import {prisma} from '@skillrecordings/database'
import {
  defaultContext as kcdStripeContent,
  eggheadReadOnlyContext as eggheadReadOnlyStripeContext,
  Stripe,
} from '@skillrecordings/stripe-sdk'
import {NonRetriableError} from 'inngest'

export const UPDATE_MERCHANT_CHARGES = 'stripe/update-merchant-charges'

export type UpdateMerchantCharges = {
  name: typeof UPDATE_MERCHANT_CHARGES
  data: {
    chargeIdentifiers: string[]
    merchantAccountId: string
  }
}

/**
 * This function is used to update the merchant charges for a given merchant account.
 * It takes a batch of "charge identifiers" (stripe IDs) and retrieves the charge details from Stripe.
 * If the charge belongs to a different merchant account, it will be retrieved from the correct account.
 * Once the charge is retrieved, it will be updated in the database.
 * This process is repeated until all charges are processed.
 */
export const updateMerchantCharges = inngest.createFunction(
  {
    id: `update-merchant-charges`,
    name: `Update Merchant Charges`,
    concurrency: {
      limit: 10,
    },
    throttle: {
      limit: 10,
      period: '1m',
    },
  },
  {
    event: UPDATE_MERCHANT_CHARGES,
  },
  async ({event, step}) => {
    const BATCH_SIZE = 50
    const {chargeIdentifiers, merchantAccountId} = event.data

    const merchantAccount = await step.run('get merchant account', async () => {
      return prisma.merchantAccount.findUnique({
        where: {
          id: merchantAccountId,
        },
      })
    })

    if (!merchantAccount) {
      throw new NonRetriableError('Merchant account not found')
    }

    const stripeContext =
      merchantAccount.label === 'stripe'
        ? kcdStripeContent
        : eggheadReadOnlyStripeContext
    if (!stripeContext) {
      throw new NonRetriableError('Stripe context not found')
    }

    const {stripe} = stripeContext

    // Process the current batch
    const currentBatch = chargeIdentifiers.slice(0, BATCH_SIZE)
    for (const chargeIdentifier of currentBatch) {
      let merchantAccountId = merchantAccount.id
      let chargeResponse = await step.run(
        `sync charge for ${chargeIdentifier}`,
        async () => {
          try {
            return (await stripe.charges.retrieve(chargeIdentifier, {
              expand: ['balance_transaction'],
            })) as Stripe.Charge & {
              balance_transaction: Stripe.BalanceTransaction
            }
          } catch (error) {
            if (
              error instanceof Error &&
              error.message.includes('No such charge')
            ) {
              return 'wrong account'
            }
            throw error // Re-throw if it's not the expected error
          }
        },
      )

      if (chargeResponse === 'wrong account') {
        const otherMerchantAccount = await step.run(
          'get other merchant account',
          async () => {
            return prisma.merchantAccount.findFirst({
              where: {
                NOT: {
                  label: merchantAccount.label,
                },
              },
            })
          },
        )

        if (!otherMerchantAccount) {
          continue
        }

        merchantAccountId = otherMerchantAccount.id

        const otherStripeContext =
          otherMerchantAccount.label === 'stripe'
            ? kcdStripeContent
            : eggheadReadOnlyStripeContext

        if (!otherStripeContext) {
          throw new NonRetriableError('Stripe context not found')
        }
        const {stripe} = otherStripeContext
        chargeResponse = await step.run(
          `retry sync charge for ${chargeIdentifier}`,
          async () => {
            return (await stripe.charges.retrieve(chargeIdentifier, {
              expand: ['balance_transaction'],
            })) as Stripe.Charge & {
              balance_transaction: Stripe.BalanceTransaction
            }
          },
        )
      }

      if (typeof chargeResponse === 'string') {
        continue
      }

      if (!chargeResponse?.balance_transaction) {
        throw new NonRetriableError('missing balance transaction')
      }

      await step.run(`update charge for ${chargeIdentifier}`, async () => {
        return prisma.merchantCharge.update({
          where: {
            identifier: chargeIdentifier,
          },
          data: {
            merchantAccountId,
            amount: chargeResponse.amount,
            fee: chargeResponse.balance_transaction?.fee,
            refundAmount: chargeResponse.amount_refunded,
            net: chargeResponse.balance_transaction?.net,
          },
        })
      })
    }

    // Send remaining identifiers back through the same event function
    const remainingIdentifiers = chargeIdentifiers.slice(BATCH_SIZE)
    if (remainingIdentifiers.length > 0) {
      await step.sendEvent('send remaining identifiers', {
        name: UPDATE_MERCHANT_CHARGES,
        data: {
          chargeIdentifiers: remainingIdentifiers,
          merchantAccountId: event.data.merchantAccountId,
        },
      })
    }

    return {
      processedCount: currentBatch.length,
      remainingCount: remainingIdentifiers.length,
    }
  },
)
