import * as React from 'react'
import {FormattedPrice} from '../utils/format-prices-for-product'
import {CheckCircleIcon} from '@heroicons/react/outline'
import {useDebounce} from '@skillrecordings/react'
import type {SanityProduct} from 'pages/buy'
import {Purchase} from '@prisma/client'
import {useQuery} from 'react-query'
import Spinner from './spinner'
import Image from 'next/image'
import cx from 'classnames'

type PricingProps = {
  product: SanityProduct
  purchased?: boolean
  purchases?: Purchase[]
  userId?: string
  index: number
}

/**
 * Pricing component for the product.
 * @param product
 * @param purchased
 * @param purchases
 * @param userId - If user is logged in, this is the user's ID.
 * @param index
 * @constructor
 */
export const Pricing: React.FC<PricingProps> = ({
  product,
  purchased = false,
  purchases = [],
  userId,
  index,
}) => {
  const [coupon, setCoupon] = React.useState()
  const [quantity, setQuantity] = React.useState(1)
  const debouncedQuantity: number = useDebounce<number>(quantity, 250)
  const {productId, name, image, modules, features, action} = product
  const {data: formattedPrice, status} = useQuery<FormattedPrice>(
    ['pricing', coupon, debouncedQuantity, productId, userId],
    () =>
      fetch('/api/prices', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          coupon,
          quantity,
          purchases,
          userId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json()),
  )

  const availableCoupon = formattedPrice?.availableCoupons?.[0]
  const appliedCoupon = formattedPrice?.appliedCoupon
  const percentOffLabel =
    appliedCoupon &&
    `${Math.floor(appliedCoupon.percentageDiscount * 100)}% off of $${
      (formattedPrice?.unitPrice || 0) * (formattedPrice?.quantity || 0)
    }`

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-[-248px] w-full h-full max-w-[400px] max-h-[400px]">
        <Image
          src={image.url}
          alt={image.alt}
          quality={100}
          layout={'fill'}
          objectFit="cover"
          aria-hidden="true"
        />
      </div>
      <article className="bg-white rounded-md flex flex-col items-center justify-center">
        <div className={cx('pt-24 flex flex-col items-center')}>
          <span
            data-pricing-product-name-badge={index}
            className="inline-flex px-4 py-1 pb-1.5 rounded-full font-nav text-sm font-semibold tracking-wide uppercase"
          >
            {name}
          </span>
          <div className="mt-4 flex items-baseline text-6xl font-bold font-heading">
            {status === 'loading' ? (
              <div className="pt-4 pb-3">
                <span className="sr-only">Loading price</span>
                <Spinner aria-hidden="true" className="w-8 h-8" />
              </div>
            ) : (
              <>
                <sup
                  aria-hidden="true"
                  className="text-lg -translate-y-4 pr-0.5 opacity-90"
                >
                  US
                </sup>
                <div aria-live="polite">
                  {'$' + formattedPrice?.calculatedPrice}
                  {appliedCoupon && (
                    <div className="sr-only">
                      {appliedCoupon.type === 'bulk' ? (
                        <div className="font-medium">Team discount.</div>
                      ) : null}{' '}
                      {percentOffLabel}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="text-sm opacity-80 pt-2">yours forever</div>
          {appliedCoupon ? (
            <div className="text-center">
              <div className="mt-4 text-2xl font-bold text-green-700">
                {percentOffLabel}
              </div>
              {appliedCoupon.type === 'site' ? (
                <div className="font-medium">There is a sale!</div>
              ) : null}
              {appliedCoupon.type === 'ppp' ? (
                <div className="font-medium">For regional discount.</div>
              ) : null}
              {appliedCoupon.type === 'bulk' ? (
                <div className="font-medium">Team discount.</div>
              ) : null}
            </div>
          ) : null}
          {availableCoupon ? (
            <div
              onClick={() => {
                setCoupon(availableCoupon.id)
              }}
            >
              {availableCoupon.type}
            </div>
          ) : null}
        </div>
        {purchased ? (
          <div className="w-full px-8">
            <button
              data-pricing-product-checkout-button={index}
              className="flex text-center px-5 py-4 font-nav font-semibold items-center justify-center rounded-md w-full text-lg gap-1"
              type="submit"
              role="link"
              disabled
            >
              <CheckCircleIcon aria-hidden="true" className="mt-0.5 w-6 h-6" />{' '}
              Purchased
            </button>
          </div>
        ) : (
          <form
            action={`/api/stripe/checkout?productId=${
              formattedPrice?.id
            }&couponId=${appliedCoupon?.id}&quantity=${quantity}${
              userId ? `&userId=${userId}` : ``
            }${
              formattedPrice?.upgradeFromPurchaseId
                ? `&upgradeFromPurchaseId=${formattedPrice?.upgradeFromPurchaseId}`
                : ``
            }`}
            method="POST"
            className="pt-8 xl:px-12 px-5 flex flex-col items-center justify-center w-full"
          >
            <div className="mb-5">
              <label className=" flex items-center gap-3">
                <span className="opacity-80">Seats</span>
                <input
                  className="bg-gray-100 border border-gray-200 pl-3 py-2 rounded-md font-bold font-mono"
                  type="number"
                  min={1}
                  max={102}
                  step={1}
                  onChange={(e) => {
                    setCoupon(undefined)
                    setQuantity(Number(e.target.value))
                  }}
                  value={quantity}
                  id={`${quantity}-${name}`}
                  required={true}
                />
              </label>
            </div>
            <button
              data-pricing-product-checkout-button={index}
              className="flex text-center px-5 py-4 pb-[1.1rem] font-nav font-semibold items-center justify-center rounded-md w-full text-lg transition"
              type="submit"
            >
              <span className="relative z-10">
                {formattedPrice?.upgradeFromPurchaseId
                  ? `Upgrade Now`
                  : action || `Ship Accessible Apps Like a Pro`}
              </span>
            </button>
          </form>
        )}
        <div className="pt-10 w-full">
          <div className="relative flex items-center justify-center before:left-0 before:content-[''] before:w-full before:h-px before:bg-gray-100 before:absolute">
            <span className="relative bg-white px-4 uppercase text-xs font-medium text-gray-500">
              includes
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 space-y-6 xl:p-10 sm:p-5 p-3 sm:pt-6">
          <strong className="font-medium">Modules</strong>
          <ul role="list" className="space-y-3">
            {modules.map((module: {title: string}) => (
              <li key={module.title} className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircleIcon
                    className="h-6 w-6 text-green-500"
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-3 text-base text-gray-700">{module.title}</p>
              </li>
            ))}
          </ul>
          {features && (
            <>
              <strong className="font-medium">Bonuses</strong>
              <ul role="list" className="space-y-4">
                {features.map((feature: {value: string}) => (
                  <li key={feature.value} className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon
                        className="h-6 w-6 text-green-500"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      {feature.value}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </article>
    </div>
  )
}
