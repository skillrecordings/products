import React from 'react'
import {Coupon} from '@skillrecordings/types'
type ParityCouponMessage = {
  coupon: Coupon
  countryName: string
  onApply: () => void
  onDismiss: () => void
  isPPP?: boolean
}

const ParityCouponMessage = ({
  coupon,
  countryName,
  onApply,
  onDismiss,
  isPPP,
}: ParityCouponMessage) => {
  const percentOff = coupon && coupon.coupon_discount * 100
  const [showFlag, setShowFlag] = React.useState<boolean>(false)
  return (
    <div className="max-w-sm mx-auto p-4 rounded-lg border-gray-300 border border-dashed text-left text-[0.95rem]">
      <h2 className=" font-semibold mb-4 sm:text-left text-center">
        We noticed that you're from{' '}
        <img
          loading="lazy"
          width={showFlag ? 18 : 0}
          onLoad={() => setShowFlag(true)}
          alt={coupon.coupon_region_restricted_to}
          className={`inline-block ${showFlag ? 'mr-1' : ''}`}
          src={`https://hardcore-golick-433858.netlify.app/image?code=${coupon.coupon_region_restricted_to}`}
        />
        {countryName}. 👋 To help facilitate global learning, we are offering
        purchasing power parity pricing.
      </h2>
      <p>
        Please note that you will only be able to view content from within{' '}
        {countryName}, and{' '}
        <strong>no downloads/bonuses will be provided</strong>.
      </p>
      <p className="inline-block mt-5">If that is something that you need:</p>
      <div className="mt-4">
        <label
          className={`inline-flex items-center p-2 w-full rounded-md hover:bg-gray-50 leading-tight transition-all ease-in-out duration-150 cursor-pointer border ${
            isPPP ? 'border-blue-500 bg-white' : ' border-gray-300'
          }`}
        >
          <input
            className="rounded-sm"
            name="isPPPActivated"
            type="checkbox"
            checked={isPPP}
            onChange={isPPP ? onDismiss : onApply}
          />
          <span className="ml-2 font-semibold">
            {isPPP
              ? `Activated ${percentOff}% off with regional pricing`
              : `Activate ${percentOff}% off with regional pricing`}
          </span>
        </label>
        {isPPP && (
          <div className="mt-4">
            🛑 You currently have a Purchasing Power Parity coupon applied. With
            this discount your purchase will be restricted to your country
            region/country. You will have the opportunity to upgrade to a full
            license at a later time if you choose to do so.
          </div>
        )}
      </div>
    </div>
  )
}

export default ParityCouponMessage
