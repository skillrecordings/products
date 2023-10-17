import {trpc} from 'trpc/trpc.client'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'

export function useBonuses(purchaseId?: string) {
  const {data: availableBonuses = []} =
    trpc.bonuses.availableBonusesForPurchase.useQuery({
      purchaseId,
    })

  const {mutate: redeemBonus} = trpc.bonuses.redeemBonus.useMutation({
    onSettled: async ({data}) => {
      switch (data?.status) {
        case 'claimed':
          track('claimed bonus', {bonus: data.bonusSlug})
          // display a notice that they have claimed a license
          // and an email has been dispatched
          break
        case 'already-owned':
          track('claimed bonus failed', {bonus: data.bonusSlug})
          // display a notice that an email has been dispatched
          break
        default:
        // display a notice that an error occurred and to email support
      }
    },
  })
  return {
    availableBonuses,
    redeemBonus,
  }
}
