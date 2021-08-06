import React from 'react'
import ClaimCouponOverlay from 'components/commerce/claim-coupon-overlay'
import get from 'lodash/get'
import {SellableResource} from '@types'
import {useCommerceMachine} from '@skillrecordings/core'

type ClaimCouponProps = {
  sellable: SellableResource
}
function ClaimCoupon({sellable}: ClaimCouponProps) {
  const [state, send] = useCommerceMachine({sellable})
  const couponError = get(state, 'context.error')
  const showClaimCoupon = get(state, 'context.price.price') === 0 || couponError
  return showClaimCoupon ? (
    <ClaimCouponOverlay
      error={couponError}
      purchaseState={state.value}
      onPurchaseComplete={({email}) => {
        send('CLAIM_COUPON', {email})
      }}
    />
  ) : null
}

export default ClaimCoupon
