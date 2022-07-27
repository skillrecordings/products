import * as React from 'react'
import {FormattedPrice} from '../utils/format-prices-for-product'
import {usePriceCheck} from '../context/pricing-check-context'
import {SanityProduct} from '../utils/props-for-commerce'
import {CheckCircleIcon} from '@heroicons/react/outline'
import {getCouponLabel} from 'utils/get-coupon-label'
import {useDebounce} from '@skillrecordings/react'
import {useQuery} from 'react-query'
import SaleCountdown from './sale-countdown'
import Spinner from './spinner'
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
export const Pricing: React.FC<PricingProps> = ({
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
  const {productId, name, image, modules, features, action} = product
  const {addPrice, isDowngrade} = usePriceCheck()

  const {data: formattedPrice, status} = useQuery<FormattedPrice>(
    ['pricing', merchantCoupon, debouncedQuantity, productId, userId, couponId],
    () =>
      fetch('/api/prices', {
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

  const percentOff =
    appliedMerchantCoupon &&
    Math.floor(appliedMerchantCoupon.percentageDiscount * 100)

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
        {appliedMerchantCoupon && (
          <Ribbon appliedMerchantCoupon={appliedMerchantCoupon} />
        )}
        <div className={cx('pt-24 flex flex-col items-center')}>
          <h4
            data-pricing-product-name-badge={index}
            className="inline-flex px-4 py-1 pb-1.5 rounded-full font-nav text-sm font-semibold tracking-wide uppercase"
          >
            {name}
          </h4>
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
                  className="text-lg -translate-y-4 pr-0.5 opacity-80 font-extrabold"
                >
                  US
                </sup>
                <div aria-live="polite" className="flex">
                  {'$' + formattedPrice?.calculatedPrice}
                  {appliedMerchantCoupon && (
                    <>
                      <div
                        aria-hidden="true"
                        className="flex flex-col items-start pl-2"
                      >
                        <div className="text-4xl font-semibold opacity-80 relative flex items-center justify-center before:content-[''] before:absolute before:w-full before:scale-110 before:h-[3px] before:bg-green-600 before:opacity-90 before:-rotate-12">
                          {'$' + fullPrice}
                        </div>
                        <div className="text-white bg-green-600 rounded text-sm font-bold uppercase font-sans px-1 text-center tabular-nums">
                          Save {percentOff}%
                        </div>
                      </div>
                      <div className="sr-only">
                        {appliedMerchantCoupon.type === 'bulk' ? (
                          <div className="font-medium">Team discount.</div>
                        ) : null}{' '}
                        {percentOffLabel}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="text-sm opacity-80 pt-2">yours forever</div>
        </div>
        {purchased ? (
          <div className="w-full px-8">
            <div className="flex text-center px-5 py-5 font-nav font-semibold items-center justify-center rounded-md w-full text-lg gap-1 my-8 shadow-inner bg-green-700 bg-noise text-white after:hidden">
              <CheckCircleIcon aria-hidden="true" className="mt-0.5 w-6 h-6" />{' '}
              Purchased
            </div>
          </div>
        ) : isDowngrade(formattedPrice) ? (
          <div className="w-full px-8">
            <div className="flex text-center px-5 py-5 font-nav font-semibold items-center justify-center rounded-md w-full text-lg gap-1 my-8 border-2 border-gray-100 after:hidden">
              Unavailable
            </div>
          </div>
        ) : (
          <form
            action={`/api/stripe/checkout?productId=${
              formattedPrice?.id
            }&couponId=${appliedMerchantCoupon?.id}&quantity=${quantity}${
              userId ? `&userId=${userId}` : ``
            }${
              formattedPrice?.upgradeFromPurchaseId
                ? `&upgradeFromPurchaseId=${formattedPrice?.upgradeFromPurchaseId}`
                : ``
            }`}
            method="POST"
            className="pt-8 xl:px-10 px-5 flex flex-col items-center justify-center w-full"
          >
            <fieldset className="w-full">
              <legend className="sr-only">{name}</legend>
              {productId === process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID && (
                <div className="mb-5 xl:px-12 px-5 flex flex-col items-center justify-center w-full">
                  <label className=" flex items-center gap-3">
                    <span className="opacity-80">Seats</span>
                    <input
                      className="bg-gray-100 border border-gray-200 pl-3 py-2 rounded-md font-bold font-mono"
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
                className="flex text-center px-5 py-4 pb-[1.1rem] font-nav font-semibold items-center justify-center rounded-md w-full text-lg transition disabled:cursor-wait"
                type="submit"
                disabled={status === 'loading' || status === 'error'}
              >
                <span className="relative z-10">
                  {formattedPrice?.upgradeFromPurchaseId
                    ? `Upgrade Now`
                    : action || `Ship Accessible Apps Like a Pro`}
                </span>
              </button>
            </fieldset>
          </form>
        )}
        <SaleCountdown
          coupon={defaultCoupon}
          data-pricing-product-sale-countdown={index}
        />
        {showPPPBox && (
          <RegionalPricingBox
            pppCoupon={pppCoupon || merchantCoupon}
            activeCoupon={merchantCoupon}
            setActiveCoupon={setMerchantCoupon}
            index={index}
          />
        )}
        <div className="pt-8 w-full">
          <div className="relative flex items-center justify-center before:left-0 before:content-[''] before:w-full before:h-px before:bg-gray-100 before:absolute">
            <span className="relative bg-white px-4 uppercase text-xs font-medium text-gray-500">
              includes
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 space-y-6 xl:p-8 sm:p-5 p-3 sm:pt-6">
          {/* <strong className="font-medium">Modules</strong> */}
          <ul role="list" className="space-y-2 ">
            {modules.map((module) => (
              <li key={module.title} className="flex items-center">
                <div
                  aria-hidden="true"
                  className="flex-shrink-0 flex items-center justify-center"
                >
                  <Image
                    src={module.image.url}
                    width={50}
                    height={50}
                    alt={module.image.alt}
                  />
                </div>
                <p className="ml-3 text-base text-gray-700 font-medium">
                  {module.title}
                </p>
              </li>
            ))}
          </ul>
          {features && (
            <>
              <strong className="font-medium">Features</strong>
              <ul role="list" className="space-y-4">
                {features.map((feature: {value: string}) => (
                  <li key={feature.value} className="flex items-start">
                    <div className="flex-shrink-0">
                      <span aria-hidden="true" className="mt-1">
                        <Image
                          src={require('../../public/assets/icons/checkmark.png')}
                          width={22}
                          height={22}
                          alt=""
                        />
                      </span>
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

type RegionalPricingBoxProps = {
  pppCoupon: {
    country: string
    percentageDiscount: number
  }
  activeCoupon: any
  setActiveCoupon: (coupon: any) => void
  index: number
}

const RegionalPricingBox: React.FC<RegionalPricingBoxProps> = ({
  pppCoupon,
  activeCoupon,
  setActiveCoupon,
  index,
}) => {
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
      className="rounded-md mt-5 sm:px-10 px-5 w-full"
    >
      <div className="space-y-4  w-full">
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
      <label className="tabular-nums accent-green-600 cursor-pointer flex gap-2  hover:bg-gray-50 rounded-md border border-gray-100 transition p-3 font-medium">
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

const Ribbon: React.FC<RibbonProps> = ({appliedMerchantCoupon}) => {
  return (
    <div className="absolute -top-3 -right-3 aspect-square w-32 overflow-hidden rounded">
      <div className="absolute top-0 left-0 h-3 w-3 bg-amber-500"></div>
      <div className="absolute bottom-0 right-0 h-3 w-3 bg-amber-500"></div>
      <div className="absolute bottom-0 right-0 h-6 w-[141.42%] origin-bottom-right rotate-45 bg-amber-300">
        {appliedMerchantCoupon && (
          <div className="flex flex-col items-center py-1 text-xs font-bold uppercase">
            {getCouponLabel(appliedMerchantCoupon.type)}
          </div>
        )}
      </div>
    </div>
  )
}
