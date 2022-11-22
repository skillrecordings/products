import React from 'react'
import SelfRedeemButton from './self-redeem-button'
import CopyInviteLink from './copy-invite-link'
import Link from 'next/link'
import {z} from 'zod'

type InviteTeamProps = {
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

const InviteTeam: React.FC<React.PropsWithChildren<InviteTeamProps>> = ({
  purchase,
  existingPurchase,
  session,
  setPersonalPurchase,
}) => {
  const bulkCouponSchema = z
    .object({id: z.string(), maxUses: z.number(), usedCount: z.number()})
    .transform(({id, maxUses, usedCount}) => {
      return {
        bulkCouponId: id,
        maxUses,
        usedCount,
        numberOfRedemptionsLeft: maxUses - usedCount,
        hasRedemptionsLeft: maxUses > usedCount,
      }
    })

  const {
    bulkCouponId,
    maxUses,
    usedCount,
    numberOfRedemptionsLeft,
    hasRedemptionsLeft,
  } = bulkCouponSchema.parse(purchase.bulkCoupon)

  const [canRedeem, setCanRedeem] = React.useState(
    Boolean(hasRedemptionsLeft && !existingPurchase),
  )
  const userEmail = session?.user?.email

  return (
    <>
      <p className="py-3">
        You have <strong>{numberOfRedemptionsLeft} seats left</strong>.{' '}
        {hasRedemptionsLeft &&
          bulkCouponId &&
          'Send the invite link below to your colleagues to get started:'}
      </p>
      {usedCount > 0 && (
        <p className="pb-3 text-xs">
          Your team has already redeemed {usedCount} of {maxUses} seats.
        </p>
      )}
      {hasRedemptionsLeft && bulkCouponId && (
        <>
          <div className="w-full ">
            <CopyInviteLink bulkCouponId={bulkCouponId} />
          </div>
          {canRedeem && (
            <div className="mt-5 flex flex-col items-center gap-3 border-t border-gray-100 pt-5 sm:mt-8 sm:flex-row sm:justify-between">
              <p className="flex items-center gap-1 font-semibold">
                Or get access yourself
              </p>
              <SelfRedeemButton
                bulkCouponId={bulkCouponId}
                userEmail={userEmail}
                onSuccess={(redeemedPurchase) => {
                  setCanRedeem(false)
                  setPersonalPurchase(redeemedPurchase)
                }}
              />
            </div>
          )}
        </>
      )}
      {!hasRedemptionsLeft && (
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
          <Link href="/#buy">
            <a className="flex-shrink-0 rounded-md bg-cyan-500 px-4 py-2 font-semibold text-white transition hover:bg-cyan-600">
              Buy more seats
            </a>
          </Link>
        </div>
      )}
    </>
  )
}

export default InviteTeam
