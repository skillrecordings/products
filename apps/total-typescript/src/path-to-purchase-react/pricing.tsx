import * as React from 'react'
import {usePriceCheck} from './pricing-check-context'
import type {
  SanityProduct,
  FormattedPrice,
} from '@skillrecordings/commerce-server/dist/@types'
import {CheckCircleIcon} from '@heroicons/react/outline'
import {getCouponLabel} from 'path-to-purchase-react/get-coupon-label'
import {useDebounce} from '@skillrecordings/react'
import {useQuery} from 'react-query'
import Spinner from '../components/spinner'
import Image from 'next/image'
import find from 'lodash/find'
import cx from 'classnames'
import {Purchase} from '@skillrecordings/database'

function getFirstPPPCoupon(availableCoupons: any[] = []) {
  return find(availableCoupons, (coupon) => coupon.type === 'ppp') || false
}

type PricingProps = {
  product: SanityProduct
  purchased?: boolean
  purchases?: Purchase[]
  userId?: string
  index: number
  couponId?: string
}

/**
 * Pricing component for the product.
 * @param product
 * @param purchased
 * @param purchases
 * @param userId - If user is logged in, this is the user's ID.
 * @param index
 * @param couponId
 * @constructor
 */
export const Pricing: React.FC<React.PropsWithChildren<PricingProps>> = ({
  product,
  purchased = false,
  purchases = [],
  userId,
  index,
  couponId,
}) => {
  const [merchantCoupon, setMerchantCoupon] = React.useState<{
    id: string
    type: string
  }>()
  const [quantity, setQuantity] = React.useState(1)
  const debouncedQuantity: number = useDebounce<number>(quantity, 250)
  const {productId, name, image, modules, description, features, action} =
    product
  const {addPrice, isDowngrade, isDiscount} = usePriceCheck()

  const {data: formattedPrice, status} = useQuery<FormattedPrice>(
    ['pricing', merchantCoupon, debouncedQuantity, productId, userId, couponId],
    () =>
      fetch('/api/skill/prices', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          ...(merchantCoupon && {merchantCouponId: merchantCoupon.id}),
          quantity,
          purchases,
          userId,
          siteCouponId: couponId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((formattedPrice: FormattedPrice) => {
          addPrice(formattedPrice, productId)
          return formattedPrice
        }),
  )

  const defaultCoupon = formattedPrice?.defaultCoupon
  const appliedMerchantCoupon = formattedPrice?.appliedMerchantCoupon

  const fullPrice =
    (formattedPrice?.unitPrice || 0) * (formattedPrice?.quantity || 0)

  const percentOff = appliedMerchantCoupon
    ? Math.floor(appliedMerchantCoupon.percentageDiscount * 100)
    : formattedPrice && isDiscount(formattedPrice)
    ? Math.floor(
        (formattedPrice.calculatedPrice / formattedPrice.unitPrice) * 100,
      )
    : 0

  const percentOffLabel =
    appliedMerchantCoupon && `${percentOff}% off of $${fullPrice}`

  const pppCoupon = getFirstPPPCoupon(formattedPrice?.availableCoupons)

  // if there is no available coupon, hide the box (it's not a toggle)
  // only show the box if ppp coupon is available
  // do not show the box if purchased
  // do not show the box if it's a downgrade
  const showPPPBox =
    (pppCoupon || merchantCoupon?.type === 'ppp') &&
    !purchased &&
    !isDowngrade(formattedPrice)

  return (
    <div
      data-pricing-product={index}
      className="relative flex flex-col items-center"
    >
      {image?.url && (
        <div className="flex items-center justify-center">
          <Image
            src={image.url}
            alt={image.alt}
            quality={100}
            width={335}
            height={440}
            priority
            aria-hidden="true"
          />
        </div>
      )}
      <article className="flex flex-col items-center justify-center rounded-md pt-5">
        <div className={cx('flex flex-col items-center')}>
          <h3
            data-pricing-product-name-badge={index}
            className="font-brandon text-lg font-medium uppercase tracking-[0.075em]"
          >
            {name === 'Limited Edition Hardcover' ? (
              <>
                <span className="text-orange-300">Limited Edition</span>{' '}
                Hardcover
              </>
            ) : (
              name
            )}
          </h3>
          <div className="font-din flex items-baseline pt-8 text-7xl font-bold md:text-8xl">
            {status === 'loading' ? (
              <div className="py-9">
                <span className="sr-only">Loading price</span>
                <Spinner aria-hidden="true" className="h-10 w-10" />
              </div>
            ) : (
              <>
                <sup
                  aria-hidden="true"
                  className="-translate-y-4 pr-0.5 text-3xl font-extrabold text-gray-300 sm:text-4xl"
                >
                  US
                </sup>
                <div aria-live="polite" className="flex">
                  <span>{'$' + formattedPrice?.calculatedPrice}</span>
                  {Boolean(
                    appliedMerchantCoupon || isDiscount(formattedPrice),
                  ) && (
                    <>
                      <div
                        aria-hidden="true"
                        className="flex flex-col items-start pl-2"
                      >
                        <div className="relative flex items-center justify-center text-4xl font-semibold opacity-80 before:absolute before:h-[3px] before:w-full before:-rotate-12 before:scale-110 before:bg-gray-500 before:opacity-90 before:content-['']">
                          {'$' + fullPrice.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-gray-700 px-1 text-center font-sans text-sm font-bold uppercase tabular-nums text-white">
                            Save {percentOff}%
                          </div>
                          {Boolean(
                            appliedMerchantCoupon || isDiscount(formattedPrice),
                          ) && (
                            <div className="font-brandon text-base">
                              {getCouponLabel(appliedMerchantCoupon?.type)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="sr-only">
                        {appliedMerchantCoupon?.type === 'bulk' ? (
                          <div className="font-medium">Bulk discount.</div>
                        ) : null}{' '}
                        {percentOffLabel}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        {purchased ? (
          <div className="w-full px-8">
            <div className="font-nav bg-noise my-8 flex w-full items-center justify-center gap-1 bg-green-700 px-5 py-5 text-center text-lg font-semibold text-white shadow-inner after:hidden">
              <CheckCircleIcon aria-hidden="true" className="mt-0.5 h-6 w-6" />{' '}
              Purchased
            </div>
          </div>
        ) : isDowngrade(formattedPrice) ? (
          <div className="w-full px-8">
            <div className="font-nav my-8 flex w-full items-center justify-center gap-1 border-2 border-gray-100 px-5 py-5 text-center text-lg font-semibold after:hidden">
              Unavailable
            </div>
          </div>
        ) : (
          <form
            action={`/api/skill/checkout/stripe?productId=${
              formattedPrice?.id
            }&couponId=${appliedMerchantCoupon?.id}&quantity=${quantity}${
              userId ? `&userId=${userId}` : ``
            }${
              formattedPrice?.upgradeFromPurchaseId
                ? `&upgradeFromPurchaseId=${formattedPrice?.upgradeFromPurchaseId}`
                : ``
            }`}
            method="POST"
            className="flex w-full flex-col items-center justify-center px-5 pt-5 xl:px-10"
          >
            <fieldset className="w-full">
              <legend className="sr-only">{name}</legend>
              {productId === process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID && (
                <div className="mb-10 flex w-full flex-col items-center justify-center px-5 xl:px-12">
                  <label className=" flex items-center gap-3">
                    <span className="opacity-80">Qty.</span>
                    <input
                      className="font-brandon border border-gray-700/80 bg-gray-900 py-2 pl-3 focus-visible:border-transparent"
                      type="number"
                      min={1}
                      max={100}
                      step={1}
                      onChange={(e) => {
                        const quantity = Number(e.target.value)
                        setMerchantCoupon(undefined)
                        setQuantity(
                          quantity < 1 ? 1 : quantity > 100 ? 100 : quantity,
                        )
                      }}
                      value={quantity}
                      id={`${quantity}-${name}`}
                      required={true}
                    />
                  </label>
                </div>
              )}
              <button
                data-pricing-product-checkout-button={index}
                className="font-brandon flex w-full items-center justify-center rounded-sm px-16 py-5 text-center text-lg font-extrabold uppercase tracking-wide transition disabled:cursor-wait"
                type="submit"
                disabled={status === 'loading' || status === 'error'}
              >
                <span className="relative z-10">
                  {formattedPrice?.upgradeFromPurchaseId
                    ? `Upgrade Now`
                    : action || `Buy Now`}
                </span>
              </button>
            </fieldset>
          </form>
        )}
        {/* {showPPPBox && (
          <RegionalPricingBox
            pppCoupon={pppCoupon || merchantCoupon}
            activeCoupon={merchantCoupon}
            setActiveCoupon={setMerchantCoupon}
            index={index}
          />
        )} */}
        {description && (
          <p className="font-brandon pt-8 text-center text-lg text-gray-200">
            {description}
          </p>
        )}
        {features && (
          <div className="flex flex-1 flex-col justify-between space-y-6 p-3 px-6 pt-6 pb-8 sm:p-5 sm:pt-6 xl:p-8">
            <>
              <strong className="font-medium">Features</strong>
              <ul role="list" className="space-y-4">
                {features.map((feature: {value: string}) => (
                  <li key={feature.value} className="flex items-start">
                    <div className="flex-shrink-0">
                      <span aria-hidden="true" className="mt-1">
                        ✓
                      </span>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      {feature.value}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          </div>
        )}
      </article>
    </div>
  )
}

type RegionalPricingBoxProps = {
  pppCoupon: {
    country: string
    percentageDiscount: number
  }
  activeCoupon: any
  setActiveCoupon: (coupon: any) => void
  index: number
}

const RegionalPricingBox: React.FC<
  React.PropsWithChildren<RegionalPricingBoxProps>
> = ({pppCoupon, activeCoupon, setActiveCoupon, index}) => {
  const regionNames = new Intl.DisplayNames(['en'], {type: 'region'})

  if (!pppCoupon.country) {
    console.error('No country found for PPP coupon', {pppCoupon})
    return null
  }

  const countryCode = pppCoupon.country
  const country = regionNames.of(countryCode)
  const percentOff = Math.floor(pppCoupon.percentageDiscount * 100)

  return (
    <div
      data-pricing-product-ppp={index}
      className="mt-5 w-full rounded-md px-5 sm:px-10"
    >
      <div className="w-full  space-y-4">
        <p className="font-medium">
          We noticed that you're from {country}{' '}
          <img
            className="inline-block"
            src={`https://hardcore-golick-433858.netlify.app/image?code=${countryCode}`}
            alt={`${country} flag`}
          />
          . To help facilitate global learning, we are offering purchasing power
          parity pricing.
        </p>
        <p className="">
          Please note that you will only be able to view content from within{' '}
          {country}, and no bonuses will be provided.
        </p>
        <p className="pb-5">If that is something that you need:</p>
      </div>
      <label className="flex cursor-pointer gap-2 rounded-md border  border-gray-100 p-3 font-medium tabular-nums accent-green-600 transition hover:bg-gray-50">
        <input
          type="checkbox"
          checked={Boolean(activeCoupon)}
          onChange={() => {
            activeCoupon ? setActiveCoupon(null) : setActiveCoupon(pppCoupon)
          }}
        />
        <span>Activate {percentOff}% off with regional pricing</span>
      </label>
    </div>
  )
}

type RibbonProps = {
  appliedMerchantCoupon: {
    type: string
  }
}

const Ribbon: React.FC<React.PropsWithChildren<RibbonProps>> = ({
  appliedMerchantCoupon,
}) => {
  return (
    <div className="absolute -top-3 -right-3 aspect-square w-32 overflow-hidden rounded">
      <div className="absolute top-0 left-0 h-3 w-3 bg-amber-500"></div>
      <div className="absolute bottom-0 right-0 h-3 w-3 bg-amber-500"></div>
      <div className="absolute bottom-0 right-0 h-6 w-[141.42%] origin-bottom-right rotate-45 bg-amber-300">
        <div className="flex flex-col items-center py-1 text-xs font-bold uppercase">
          {getCouponLabel(appliedMerchantCoupon?.type)}
        </div>
      </div>
    </div>
  )
}
