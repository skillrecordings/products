import * as React from 'react'
import {usePriceCheck} from './pricing-check-context'
import type {
  SanityProduct,
  FormattedPrice,
} from '@skillrecordings/commerce-server/dist/@types'
import {CheckCircleIcon} from '@heroicons/react/outline'
import {getCouponLabel} from './get-coupon-label'
import {useDebounce} from '@skillrecordings/react'
import {QueryStatus} from '@tanstack/react-query'
import SaleCountdown from './sale-countdown'
import Spinner from 'components/spinner'
import Image from 'next/legacy/image'
import find from 'lodash/find'
import {Purchase} from '@skillrecordings/database'
import ReactMarkdown from 'react-markdown'
import {MailIcon} from '@heroicons/react/solid'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {useRouter} from 'next/router'
import * as Switch from '@radix-ui/react-switch'
import {trpc} from 'utils/trpc'
import Balancer from 'react-wrap-balancer'
import {isSellingLive} from './is-selling-live'
import BuyMoreSeats from 'team/buy-more-seats'
import Link from 'next/link'

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
  index?: number
  couponId?: string
  allowPurchase?: boolean
  handleViewContents?: () => void
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
  index = 0,
  couponId,
  allowPurchase = false,
}) => {
  const [merchantCoupon, setMerchantCoupon] = React.useState<{
    id: string
    type: string
  }>()
  const [quantity, setQuantity] = React.useState(1)
  const [isBuyingForTeam, setIsBuyingForTeam] = React.useState(false)
  const debouncedQuantity: number = useDebounce<number>(quantity, 250)
  const {
    productId,
    name,
    title,
    instructor,
    image,
    modules,
    lessons,
    features,
    action,
  } = product
  const {addPrice, isDowngrade} = usePriceCheck()
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()

  const {data: formattedPrice, status} = trpc.pricing.formatted.useQuery(
    {
      productId,
      userId,
      quantity: debouncedQuantity,
      couponId,
      merchantCoupon,
    },
    {
      onSuccess: (formattedPrice) => {
        addPrice(formattedPrice, productId)
      },
    },
  )

  const defaultCoupon = formattedPrice?.defaultCoupon
  const appliedMerchantCoupon = formattedPrice?.appliedMerchantCoupon

  const pppCoupon = getFirstPPPCoupon(formattedPrice?.availableCoupons)

  // if there is no available coupon, hide the box (it's not a toggle)
  // only show the box if ppp coupon is available
  // do not show the box if purchased
  // do not show the box if it's a downgrade
  const showPPPBox =
    Boolean(pppCoupon || merchantCoupon?.type === 'ppp') &&
    !purchased &&
    !isDowngrade(formattedPrice) &&
    (allowPurchase || isSellingLive) &&
    !isBuyingForTeam

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
            <p data-name-badge="">{name}</p>
            {title && <h2 data-title>{title}</h2>}
            {instructor && (
              <div data-instructor="">
                {instructor.image && (
                  <div data-instructor-image="">
                    <Image src={instructor.image} width={60} height={60} />
                  </div>
                )}
                {instructor.name && <span>{instructor.name}</span>}
              </div>
            )}
            <PriceDisplay status={status} formattedPrice={formattedPrice} />
            <div data-byline="">Full access</div>
          </div>
        )}
        {purchased ? (
          <>
            <div data-pricing-product-header="">
              <p data-name-badge="">{name}</p>
              {title && <h2 data-title>{title}</h2>}
            </div>
            <div data-purchased-container="">
              <div data-purchased="">
                <CheckCircleIcon aria-hidden="true" /> Purchased
              </div>
              <div className="flex flex-col justify-center">
                <BuyMoreSeats productId={productId} userId={userId as string} />
              </div>
            </div>
          </>
        ) : isSellingLive || allowPurchase ? (
          isDowngrade(formattedPrice) ? (
            <div data-downgrade-container="">
              <div data-downgrade="">Unavailable</div>
            </div>
          ) : (
            <div data-purchase-container="">
              <form
                action={`/api/skill/checkout/stripe?productId=${
                  formattedPrice?.id
                }&couponId=${appliedMerchantCoupon?.id}&bulk=${
                  isBuyingForTeam ? 'true' : 'false'
                }&quantity=${quantity}${userId ? `&userId=${userId}` : ``}${
                  formattedPrice?.upgradeFromPurchaseId
                    ? `&upgradeFromPurchaseId=${formattedPrice?.upgradeFromPurchaseId}`
                    : ``
                }`}
                method="POST"
              >
                <fieldset>
                  <legend className="sr-only">{name}</legend>
                  <div data-team-switch="">
                    <label htmlFor="team-switch">
                      Buying for myself or for my team
                    </label>
                    <button
                      role="button"
                      type="button"
                      onClick={() => {
                        setIsBuyingForTeam(false)
                        setQuantity(1)
                      }}
                    >
                      For myself
                    </button>
                    <Switch.Root
                      aria-label={
                        isBuyingForTeam ? 'For my team' : 'For myself'
                      }
                      onCheckedChange={() => {
                        setIsBuyingForTeam(!isBuyingForTeam)
                        isBuyingForTeam ? setQuantity(1) : setQuantity(5)
                      }}
                      checked={isBuyingForTeam}
                      id="team-switch"
                    >
                      <Switch.Thumb />
                    </Switch.Root>
                    <button
                      role="button"
                      type="button"
                      onClick={() => {
                        setIsBuyingForTeam(true)
                        setQuantity(5)
                      }}
                    >
                      For my team
                    </button>
                  </div>
                  {isBuyingForTeam && (
                    <div data-quantity-input="">
                      <label>
                        <span>Team Seats</span>
                        <button
                          type="button"
                          aria-label="decrease seat quantity by one"
                          className="flex h-full items-center justify-center rounded border border-gray-200 px-3 py-2 font-mono sm:hidden"
                          onClick={() => {
                            if (quantity === 1) return
                            setQuantity(quantity - 1)
                          }}
                        >
                          -
                        </button>
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
                          onKeyDown={(e) => {
                            // don't allow decimal
                            if (e.key === ',') {
                              e.preventDefault()
                            }
                          }}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={quantity}
                          id={`${quantity}-${name}`}
                          required={true}
                        />
                        <button
                          type="button"
                          aria-label="increase seat quantity by one"
                          className="flex h-full items-center justify-center rounded border border-gray-200 px-3 py-2 font-mono sm:hidden"
                          onClick={() => {
                            if (quantity === 100) return
                            setQuantity(quantity + 1)
                          }}
                        >
                          +
                        </button>
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
                        : action || `Buy Now`}
                    </span>
                  </button>
                  <span data-guarantee="">30-Day Money-Back Guarantee</span>
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
        {isSellingLive ||
          (allowPurchase && !purchased && (
            <SaleCountdown
              coupon={defaultCoupon}
              data-pricing-product-sale-countdown={index}
            />
          ))}
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
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          )}
          {!purchased && (
            <div data-guarantee="">
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
            {modules && (
              <>
                <strong>Workshops</strong>
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
                        {module.image && (
                          <div data-image="" aria-hidden="true">
                            <Image
                              src={module.image.url}
                              layout="fill"
                              alt={module.title}
                              aria-hidden="true"
                            />
                          </div>
                        )}
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
              </>
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
            {product.slug && lessons && (
              <div data-contents="">
                {lessons ? `${lessons?.length} lessons` : null}
                <Link href={`/workshops/${product.slug}`}>
                  View contents <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

type PriceDisplayProps = {
  status: QueryStatus
  formattedPrice?: FormattedPrice
}

export const PriceDisplay = ({status, formattedPrice}: PriceDisplayProps) => {
  const {isDiscount} = usePriceCheck()

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

  return (
    <div data-price-container={status}>
      {status === 'loading' ? (
        <div data-loading-price="">
          <span className="sr-only">Loading price</span>
          <Spinner aria-hidden="true" className="h-8 w-8" />
        </div>
      ) : (
        <>
          <div aria-live="polite" data-price="">
            <sup aria-hidden="true">US</sup>
            {formattedPrice?.calculatedPrice &&
              formatUsd(formattedPrice?.calculatedPrice).dollars}
            <span className="sup text-sm" aria-hidden="true">
              {formattedPrice?.calculatedPrice &&
                formatUsd(formattedPrice?.calculatedPrice).cents}
            </span>
            {Boolean(appliedMerchantCoupon || isDiscount(formattedPrice)) && (
              <>
                <div aria-hidden="true" data-price-discounted="">
                  <div data-full-price={fullPrice}>
                    {'$' + fullPrice}
                    <span className="sup">{formatUsd(fullPrice).cents}</span>
                  </div>
                  <div data-percent-off={percentOff}>Save {percentOff}%</div>
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
            activeCoupon
              ? setActiveCoupon(undefined)
              : setActiveCoupon(pppCoupon)
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
      className="flex w-full max-w-sm flex-col items-center justify-between"
    >
      <div className="inline-flex flex-shrink-0 items-center gap-2 pb-5 text-base font-medium leading-tight">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10"
        >
          <MailIcon className="h-5 w-5 text-blue-500" />
        </div>
        <Balancer>Get notified when this workshop is released</Balancer>
      </div>
      <SubscribeToConvertkitForm
        formId={3843826}
        actionLabel="Subscribe to get notified"
        onSuccess={(subscriber, email) => {
          return handleOnSuccess(subscriber, email)
        }}
      />
    </div>
  )
}
