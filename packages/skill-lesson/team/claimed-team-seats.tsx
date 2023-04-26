import React from 'react'
import SelfRedeemButton from './self-redeem-button'
import CopyInviteLink from './copy-invite-link'
import {z} from 'zod'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import Spinner from '../spinner'

type ClaimedTeamSeatsProps = {
  purchase: {
    merchantChargeId: string | null
    bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
    product: {id: string; name: string}
  }
  existingPurchase: {
    id: string
    product: {id: string; name: string}
  }
  session: any
  setPersonalPurchase: (props: any) => void
}

export const ClaimedTeamSeats: React.FC<
  React.PropsWithChildren<ClaimedTeamSeatsProps>
> = ({purchase, existingPurchase, session, setPersonalPurchase}) => {
  const {data: claims, status} = trpcSkillLessons.coupons.claimedBy.useQuery({
    couponId: purchase?.bulkCoupon?.id,
  })

  console.log(claims)

  return (
    <div data-claimed-seats-team="">
      {status === 'loading' ? (
        <div data-loading-price="">
          <span className="sr-only">Loading price</span>
          <Spinner aria-hidden="true" className="h-8 w-8" />
        </div>
      ) : (
        <>
          {claims?.map((claim) => (
            <div data-invite-team-table-row="" key={claim.user?.email}>
              <div data-invite-team-table-cell="">{claim.user?.email}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
