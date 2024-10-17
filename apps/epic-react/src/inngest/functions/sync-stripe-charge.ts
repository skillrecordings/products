import {inngest} from '@/inngest/inngest.server'
import {prisma} from '@skillrecordings/database'
import {UPDATE_MERCHANT_CHARGES} from './update-merchant-charges'

export const SYNC_STRIPE_CHARGES = 'stripe/sync-charges'

export type SyncStripeCharges = {
  name: typeof SYNC_STRIPE_CHARGES
  data: {
    offset?: number
  }
}

/**
 * This function is used to sync the charges for all merchant accounts.
 * For each merchant account it grabs a list of charge identifiers (stripe IDs)
 * that have an amount of 0. It then sends these identifiers to the `updateMerchantCharges` function.
 * This process is repeated until all charges are processed.
 */
export const syncStripeCharges = inngest.createFunction(
  {id: `sync-stripe-charges`, name: `Sync Stripe Charges`},
  {
    event: SYNC_STRIPE_CHARGES,
  },
  async ({event, step}) => {
    const BATCH_SIZE = 500
    const merchantAccounts = await step.run(
      'get merchant accounts',
      async () => {
        return prisma.merchantAccount.findMany()
      },
    )

    let areMoreCharges = false

    for (const merchantAccount of merchantAccounts) {
      const listOfCharges = await step.run(`get list of charges`, async () => {
        return prisma.merchantCharge.findMany({
          where: {
            merchantAccountId: merchantAccount.id,
            amount: 0,
          },
          take: BATCH_SIZE,
          skip: event.data.offset || 0,
        })
      })

      if (!listOfCharges.length) {
        areMoreCharges = areMoreCharges || false
        continue
      }

      await inngest.send({
        name: UPDATE_MERCHANT_CHARGES,
        data: {
          chargeIdentifiers: listOfCharges.map((charge) => charge.identifier),
          merchantAccountId: merchantAccount.id,
        },
      })

      areMoreCharges = areMoreCharges || listOfCharges.length === BATCH_SIZE
    }

    if (areMoreCharges) {
      await step.sendEvent('send next batch', {
        name: SYNC_STRIPE_CHARGES,
        data: {
          offset: (event.data.offset || 0) + BATCH_SIZE,
        },
      })
    }

    return event.data.offset || 0
  },
)
