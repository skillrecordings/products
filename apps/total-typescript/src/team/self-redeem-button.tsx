import React from 'react'
import {handleSelfRedeem} from '../path-to-purchase-react/handle-self-redeem'
import {Button} from '@skillrecordings/react'
import {Purchase} from '@skillrecordings/database'
import toast from 'react-hot-toast'

const SelfRedeemButton: React.FC<
  React.PropsWithChildren<{
    userEmail: string | null | undefined
    bulkCouponId: string
    onSuccess: (redeemedPurchase: Purchase) => void
    className?: string
  }>
> = ({
  userEmail,
  bulkCouponId,
  onSuccess,
  className = 'border border-cyan-500 transition text-cyan-400 px-4 py-2 hover:bg-cyan-600/20 rounded-md font-semibold',
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <Button
      isLoading={isLoading}
      isDisabled={!userEmail}
      className={className}
      onClick={() => {
        if (userEmail) {
          setIsLoading(true)
          handleSelfRedeem(userEmail, bulkCouponId, (params) => {
            if (params.status === 'success') {
              onSuccess(params.redeemedPurchase)
            } else {
              // TODO: report to sentry or support?
              console.log(params.error)
              if (params.error.startsWith('already-purchased-')) {
                toast.error(
                  'You have already redeemed a seat for yourself. Please contact support if you are having trouble accessing it.',
                )
              } else {
                toast.error(
                  'We were unable to redeem a seat for this account. If the issue persists, please reach out to support.',
                )
              }
            }

            setIsLoading(false)
          })
        }
      }}
    >
      Claim one seat for yourself
    </Button>
  )
}

export default SelfRedeemButton
