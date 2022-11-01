import React from 'react'
import SelfRedeemButton from './self-redeem-button'
import CopyInviteLink from './copy-invite-link'

type InviteTeamProps = {
  purchase: {
    merchantChargeId: string | null
    bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
    product: {id: string; name: string}
  }
  existingPurchaseForSelf: boolean
  userEmail?: string | null
}

const InviteTeam: React.FC<React.PropsWithChildren<InviteTeamProps>> = ({
  purchase,
  existingPurchaseForSelf,
  userEmail,
}) => {
  const [newSelfRedemption, setNewSelfRedemption] = React.useState<
    object | undefined
  >()

  const hasPurchasedForSelf = existingPurchaseForSelf || newSelfRedemption

  const redemptionsLeft =
    purchase.bulkCoupon &&
    purchase.bulkCoupon.maxUses > purchase.bulkCoupon.usedCount
  const numberOfRedemptionsLeft =
    purchase?.bulkCoupon &&
    purchase?.bulkCoupon.maxUses - purchase.bulkCoupon.usedCount

  const [canRedeem, setCanRedeem] = React.useState(
    Boolean(redemptionsLeft && !hasPurchasedForSelf),
  )
  const bulkCouponId = purchase?.bulkCoupon?.id

  return (
    <>
      <p className="py-3">
        You have <strong>{numberOfRedemptionsLeft} seats left</strong>.{' '}
        {redemptionsLeft &&
          bulkCouponId &&
          'Send the invite link below to your colleagues to get started:'}
      </p>
      {redemptionsLeft && bulkCouponId && (
        <>
          <div className="w-full ">
            <CopyInviteLink bulkCouponId={bulkCouponId} />
          </div>
          {canRedeem && (
            <div className="flex sm:flex-row flex-col items-center sm:justify-between border-t border-gray-100 sm:mt-8 pt-5 mt-5 gap-3">
              <p className="font-semibold flex items-center gap-1">
                Or get access yourself
              </p>
              <SelfRedeemButton
                bulkCouponId={bulkCouponId}
                userEmail={userEmail}
                onSuccess={(redeemedPurchase) => {
                  setCanRedeem(false)
                  setNewSelfRedemption(redeemedPurchase)
                }}
              />
            </div>
          )}
        </>
      )}
      {!redemptionsLeft && (
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
          <p className="py-3">
            You are out of seats. To invite more people to your team, buy more
            seats.
          </p>
        </div>
      )}
    </>
  )
}

export default InviteTeam
