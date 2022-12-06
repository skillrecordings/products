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
import ReactMarkdown from 'react-markdown'
import {isSellingLive} from '../utils/is-selling-live'
import {MailIcon} from '@heroicons/react/solid'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useConvertkit} from '../hooks/use-convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '../utils/analytics'
import {useRouter} from 'next/router'

function getFirstPPPCoupon(availableCoupons: any[] = []) {
  return find(availableCoupons, (coupon) => coupon.type === 'ppp') || false
}

const formatUsd = (amount: number = 0) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const formattedPrice = formatter.format(amount).split('.')

  return {dollars: formattedPrice[0], cents: formattedPrice[1]}
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
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()

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

  const handleOnSuccess = (subscriber: any, email?: string) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath, {
        confirmToast: 'true',
      })
      email && setUserId(email)
      track('subscribed to email list', {
        location: 'pricing',
      })
      router.push(redirectUrl).then(() => {
        router.reload()
      })
    }
  }

  return (
    <div>
      <div data-pricing-product={index}>
        {image && (
          <div data-pricing-product-image="">
            <Image
              priority
              src={image.url}
              alt={image.alt}
              quality={100}
              layout={'fill'}
              objectFit="contain"
              aria-hidden="true"
            />
          </div>
        )}
        <article>
          {/* {Boolean(appliedMerchantCoupon || isDiscount(formattedPrice)) && (
          <Ribbon appliedMerchantCoupon={appliedMerchantCoupon} />
        )} */}
          {!purchased && (
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
                      {formattedPrice?.calculatedPrice &&
                        formatUsd(formattedPrice?.calculatedPrice).dollars}
                      <span className="sup text-sm">
                        {formattedPrice?.calculatedPrice &&
                          formatUsd(formattedPrice?.calculatedPrice).cents}
                      </span>
                      {Boolean(
                        appliedMerchantCoupon || isDiscount(formattedPrice),
                      ) && (
                        <>
                          <div aria-hidden="true" data-price-discounted="">
                            <div data-full-price={fullPrice}>
                              {'$' + fullPrice}
                            </div>
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
              <div data-byline="">Full access</div>
            </div>
          )}
          {purchased ? (
            <>
              <div data-pricing-product-header="">
                <h4 data-name-badge="">{name}</h4>
              </div>
              <div data-purchased-container="">
                <div data-purchased="">
                  <CheckCircleIcon aria-hidden="true" /> Purchased
                </div>
              </div>
            </>
          ) : isSellingLive ? (
            isDowngrade(formattedPrice) ? (
              <div data-downgrade-container="">
                <div data-downgrade="">Unavailable</div>
              </div>
            ) : (
              <div data-purchase-container="">
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
                    {productId ===
                      process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID && (
                      <div data-quantity-input="">
                        <label>
                          <span>Team Seats</span>
                          <input
                            type="number"
                            min={1}
                            max={100}
                            step={1}
                            onChange={(e) => {
                              const quantity = Number(e.target.value)
                              setMerchantCoupon(undefined)
                              setQuantity(
                                quantity < 1
                                  ? 1
                                  : quantity > 100
                                  ? 100
                                  : quantity,
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
              </div>
            )
          ) : (
            <div data-purchased-container="">
              <div data-unavailable="">Coming Soon</div>
              {!subscriber && !loadingSubscriber && (
                <SubscribeForm handleOnSuccess={handleOnSuccess} />
              )}
            </div>
          )}
          {isSellingLive && !purchased && (
            <SaleCountdown
              coupon={defaultCoupon}
              data-pricing-product-sale-countdown={index}
            />
          )}
          {showPPPBox && (
            <RegionalPricingBox
              pppCoupon={pppCoupon || merchantCoupon}
              activeCoupon={merchantCoupon}
              setActiveCoupon={setMerchantCoupon}
              index={index}
            />
          )}
          <div data-pricing-footer="">
            {product.description && !purchased && (
              <div className="prose prose-sm mx-auto max-w-sm px-5 prose-p:text-gray-200 sm:prose-base">
                <ReactMarkdown children={product.description} />
              </div>
            )}
            {!purchased && (
              <div className="flex justify-center pt-8 align-middle">
                <Image
                  src="https://res.cloudinary.com/total-typescript/image/upload/v1669928567/money-back-guarantee-badge-16137430586cd8f5ec2a096bb1b1e4cf_o5teov.svg"
                  width={130}
                  height={130}
                  alt="Money Back Guarantee"
                />
              </div>
            )}
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
    <div data-ppp-container={index}>
      <div data-ppp-header="">
        <strong>
          We noticed that you're from{' '}
          <img
            src={`https://hardcore-golick-433858.netlify.app/image?code=${countryCode}`}
            alt={`${country} flag`}
          />{' '}
          {country}. To help facilitate global learning, we are offering
          purchasing power parity pricing.
        </strong>
        <p>
          Please note that you will only be able to view content from within{' '}
          {country}, and no bonuses will be provided.
        </p>
        <p>If that is something that you need:</p>
      </div>
      <label>
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

const SubscribeForm = ({
  handleOnSuccess,
}: {
  handleOnSuccess: (subscriber: any, email?: string) => void
}) => {
  return (
    <div
      id="pricing"
      className="flex w-full max-w-sm flex-col items-center justify-between pb-8"
    >
      <div className="inline-flex max-w-xs flex-shrink-0 items-center gap-2 text-base font-medium leading-tight">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-800"
        >
          <MailIcon className="h-5 w-5 text-cyan-300" />
        </div>{' '}
        Get notified when Total TypeScript Vol 1. is released:
      </div>
      <SubscribeToConvertkitForm
        actionLabel="Subscribe to get notified"
        onSuccess={(subscriber, email) => {
          return handleOnSuccess(subscriber, email)
        }}
      />
    </div>
  )
}
