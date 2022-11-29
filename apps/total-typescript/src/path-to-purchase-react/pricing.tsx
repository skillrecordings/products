import * as React from 'react'
import {usePriceCheck} from './pricing-check-context'
import type {
  SanityProduct,
  FormattedPrice,
} from '@skillrecordings/commerce-server/dist/@types'
import {CheckCircleIcon} from '@heroicons/react/outline'
import {getCouponLabel} from './get-coupon-label'
import {useDebounce} from '@skillrecordings/react'
import {useQuery} from 'react-query'
import SaleCountdown from './sale-countdown'
import Spinner from 'components/spinner'
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
  const {productId, name, image, modules, features, action} = product
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
    <div data-pricing-product={index}>
      {image && (
        <div data-pricing-product-image="">
          <Image
            src={image.url}
            alt={image.alt}
            quality={100}
            layout={'fill'}
            objectFit="cover"
            aria-hidden="true"
          />
        </div>
      )}
      <article>
        {/* {Boolean(appliedMerchantCoupon || isDiscount(formattedPrice)) && (
          <Ribbon appliedMerchantCoupon={appliedMerchantCoupon} />
        )} */}
        <div data-pricing-product-header="">
          <h4 data-name-badge="">{name}</h4>
          <div data-price-container={status}>
            {status === 'loading' ? (
              <div data-loading-price="">
                <span className="sr-only">Loading price</span>
                <Spinner aria-hidden="true" className="h-8 w-8" />
              </div>
            ) : (
              <>
                <sup aria-hidden="true">US</sup>
                <div aria-live="polite" data-price="">
                  {'$' + formattedPrice?.calculatedPrice}
                  {Boolean(
                    appliedMerchantCoupon || isDiscount(formattedPrice),
                  ) && (
                    <>
                      <div aria-hidden="true" data-price-discounted="">
                        <div data-full-price={fullPrice}>{'$' + fullPrice}</div>
                        <div data-percent-off={percentOff}>
                          Save {percentOff}%
                        </div>
                      </div>
                      <div className="sr-only">
                        {appliedMerchantCoupon?.type === 'bulk' ? (
                          <div>Team discount.</div>
                        ) : null}{' '}
                        {percentOffLabel}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div data-byline="">yours forever</div>
        </div>
        {purchased ? (
          <div data-purchased-container="">
            <div data-purchased="">
              <CheckCircleIcon aria-hidden="true" /> Purchased
            </div>
          </div>
        ) : isDowngrade(formattedPrice) ? (
          <div data-downgrade-container="">
            <div data-downgrade="">Unavailable</div>
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
          >
            <fieldset>
              <legend className="sr-only">{name}</legend>
              {productId === process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID && (
                <div data-quantity-input="">
                  <label>
                    <span>Seats</span>
                    <input
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
                data-pricing-product-checkout-button=""
                type="submit"
                disabled={status === 'loading' || status === 'error'}
              >
                <span>
                  {formattedPrice?.upgradeFromPurchaseId
                    ? `Upgrade Now`
                    : action || `Become a TypeScript Wizard`}
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
        <div data-pricing-footer="">
          {modules || features ? (
            <div data-header="">
              <div>
                <span>includes</span>
              </div>
            </div>
          ) : null}
          <div data-main="">
            <strong>Workshops</strong>
            {modules && (
              <ul data-workshops="" role="list">
                {modules.map((module) => {
                  const getLabelForState = (state: any) => {
                    switch (state) {
                      case 'draft':
                        return 'Coming soon'
                      default:
                        return ''
                    }
                  }
                  return (
                    <li key={module.title}>
                      <div data-image="" aria-hidden="true">
                        <Image
                          src={module.image.url}
                          layout="fill"
                          alt={module.title}
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p>{module.title}</p>
                        <div data-state={module.state}>
                          {getLabelForState(module.state)}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
            {features && (
              <>
                <strong>Features</strong>
                <ul data-features="" role="list">
                  {features.map((feature: {value: string}) => (
                    <li key={feature.value}>
                      <p>{feature.value}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
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
      <label className="flex cursor-pointer gap-2 rounded-md border  border-gray-100 p-3 font-medium tabular-nums accent-cyan-600 transition hover:bg-gray-50">
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
        <div className="flex flex-col items-center py-1 text-xs font-bold uppercase text-black">
          {getCouponLabel(appliedMerchantCoupon?.type)}
        </div>
      </div>
    </div>
  )
}
