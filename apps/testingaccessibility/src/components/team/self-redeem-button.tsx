import React from 'react'
import {handleSelfRedeem} from 'utils/handle-self-redeem'
import {Button} from '@skillrecordings/react'
import {Purchase} from '@skillrecordings/database'

const SelfRedeemButton: React.FC<{
  userEmail: string | null | undefined
  bulkCouponId: string
  onSuccess: (redeemedPurchase: Purchase) => void
  className?: string
}> = ({
  userEmail,
  bulkCouponId,
  onSuccess,
  className = 'border border-green-500 transition text-green-600 px-4 py-2 hover:bg-green-600/5 rounded-md font-semibold',
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
          handleSelfRedeem(userEmail, bulkCouponId, (redeemedPurchase) => {
            onSuccess(redeemedPurchase)
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
