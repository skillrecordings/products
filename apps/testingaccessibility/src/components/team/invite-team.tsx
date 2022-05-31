import React from 'react'
import SelfRedeemButton from './self-redeem-button'
import CopyInviteLink from './copy-invite-link'
import Link from 'next/link'

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

const InviteTeam: React.FC<InviteTeamProps> = ({
  purchase,
  existingPurchase,
  session,
  setPersonalPurchase,
}) => {
  const redemptionsLeft =
    purchase.bulkCoupon &&
    purchase.bulkCoupon.maxUses > purchase.bulkCoupon.usedCount
  const numberOfRedemptionsLeft =
    purchase?.bulkCoupon &&
    purchase?.bulkCoupon.maxUses - purchase.bulkCoupon.usedCount

  const [canRedeem, setCanRedeem] = React.useState(
    Boolean(redemptionsLeft && !existingPurchase),
  )
  const userEmail = session?.user?.email
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
                  setPersonalPurchase(redeemedPurchase)
                }}
              />
            </div>
          )}
        </>
      )}
      {!redemptionsLeft && (
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
          <Link href="/#buy">
            <a className="font-semibold bg-green-500 transition text-white px-4 py-2 hover:bg-green-600 rounded-md flex-shrink-0">
              Buy more seats
            </a>
          </Link>
        </div>
      )}
    </>
  )
}

export default InviteTeam
