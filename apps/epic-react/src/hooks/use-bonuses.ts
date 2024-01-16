import {trpc} from '@/trpc/trpc.client'

export function useBonuses(purchaseId?: string) {
  // TODO: uncomment this when we have bonuses
  // const {data: availableBonuses = []} =
  //   trpc.bonuses.availableBonusesForPurchase.useQuery({
  //     purchaseId,
  //   })

  return {
    // availableBonuses,
    availableBonuses: [],
  }
}
