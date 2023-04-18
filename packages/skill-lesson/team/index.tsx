import React from 'react'
import SelfRedeemButton from './self-redeem-button'
import CopyInviteLink from './copy-invite-link'
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
  className?: string
}

const InviteTeam: React.FC<React.PropsWithChildren<InviteTeamProps>> = ({
  purchase,
  existingPurchase,
  session,
  setPersonalPurchase,
  className = 'flex flex-col rounded-lg border border-gray-700/30 bg-gray-800 p-5 shadow-xl shadow-black/10',
}) => {
  const [selfRedemptionSucceeded, setSelfRedemptionSucceeded] =
    React.useState<boolean>(false)

  const bulkCouponSchema = z
    .object({id: z.string(), maxUses: z.number(), usedCount: z.number()})
    .nullable()
    .transform((data, ctx) => {
      if (data === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'The purchase is either not a bulk purchase or was queried without its bulk coupon.',
        })
        return z.NEVER
      }

      const {id, maxUses, usedCount: _usedCount} = data

      // manually increment the usedCount by 1 if a self-redemption happened
      // during this componenet's lifecycle.
      const usedCount = _usedCount + (selfRedemptionSucceeded ? 1 : 0)

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

  const [canRedeem, setCanRedeem] = React.useState(Boolean(!existingPurchase))
  const userEmail = session?.user?.email

  return (
    <div className={className}>
      <p className="py-3">
        You have{' '}
        <strong className="font-semibold">
          {numberOfRedemptionsLeft} seats left
        </strong>
        .<br />
        {usedCount > 0 &&
          `Your team has already redeemed ${usedCount} of ${maxUses} seats. `}
        {hasRedemptionsLeft &&
          bulkCouponId &&
          'Send the invite link below to your colleagues to get started:'}
      </p>
      {bulkCouponId && (
        <>
          <div className="w-full ">
            <CopyInviteLink
              bulkCouponId={bulkCouponId}
              disabled={!hasRedemptionsLeft}
            />
          </div>
          {canRedeem && (
            <div className="mt-5 flex flex-col items-center gap-3 border-t border-gray-900 pt-5 sm:mt-8 sm:flex-row sm:justify-between">
              <p className="flex items-center gap-1 font-semibold">
                Or get access yourself
              </p>
              <SelfRedeemButton
                bulkCouponId={bulkCouponId}
                userEmail={userEmail}
                onSuccess={(redeemedPurchase) => {
                  setCanRedeem(false)
                  setPersonalPurchase(redeemedPurchase)
                  setSelfRedemptionSucceeded(true)
                }}
                disabled={!hasRedemptionsLeft}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InviteTeam
