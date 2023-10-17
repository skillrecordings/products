import {trpc} from 'trpc/trpc.client'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import toast from 'react-hot-toast'

export function useBonuses(purchaseId?: string) {
  const {data: availableBonuses = []} =
    trpc.bonuses.availableBonusesForPurchase.useQuery({
      purchaseId,
    })

  return {
    availableBonuses,
  }
}
