import {trpc} from 'trpc/trpc.client'

export function useBonuses(purchaseId?: string) {
  const {data: availableBonuses = []} =
    trpc.bonuses.availableBonusesForPurchase.useQuery({
      purchaseId,
    })

  return {
    availableBonuses,
  }
}
