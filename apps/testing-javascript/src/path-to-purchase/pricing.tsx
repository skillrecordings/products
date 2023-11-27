import * as React from 'react'
import {PortableText} from '@portabletext/react'
import Link from 'next/link'
import cx from 'classnames'
import * as Switch from '@radix-ui/react-switch'
import Image from 'next/legacy/image'
import find from 'lodash/find'
import type {MerchantCoupon} from '@skillrecordings/database'
import type {
  SanityProduct,
  FormattedPrice,
} from '@skillrecordings/commerce-server/dist/@types'
import {CheckCircleIcon} from '@heroicons/react/outline'
import {QueryStatus} from '@tanstack/react-query'
import Spinner from 'components/spinner'
import {usePriceCheck} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {trpc} from 'trpc/trpc.client'
import {isSellingLive} from '@skillrecordings/skill-lesson/utils/is-selling-live'
import BuyMoreSeats from './buy-more-seats'
import Icon from 'components/icons'
import {useDebounce} from '@skillrecordings/skill-lesson/hooks/use-debounce'
import {buildStripeCheckoutPath} from '@skillrecordings/skill-lesson/utils/build-stripe-checkout-path'

type MinimalMerchantCoupon = Omit<
  MerchantCoupon & {
    country?: string
  },
  'identifier'
>

function getFirstPPPCoupon(
  availableCoupons: Array<MinimalMerchantCoupon | undefined> = [],
  merchantCoupon: MinimalMerchantCoupon | undefined,
) {
  const availablePPPCoupon = find(
    availableCoupons,
    (coupon) => coupon?.type === 'ppp',
  )

  let merchantPPPCoupon: MinimalMerchantCoupon | undefined = undefined

  if (merchantCoupon?.type === 'ppp') {
    merchantPPPCoupon = merchantCoupon
  }

  return availablePPPCoupon || merchantPPPCoupon
}

const formatUsd = (amount: number = 0) => {
  const formatter = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
  })
  const formattedPrice = formatter.format(amount).split('.')

  let cents: string | undefined = undefined
  // Only set `cents` if we have a non-zero value. This preserves the existing
  // behavior where cents only gets displayed if it is something other than
  // `00`.
  if (Number.parseInt(formattedPrice[1]) !== 0) {
    cents = formattedPrice[1]
  }

  return {dollars: formattedPrice[0], cents}
}

type PricingProps = {
  product: SanityProduct
  purchased?: boolean
  userId?: string
  index?: number
  couponId?: string
  allowPurchase?: boolean
  handleViewContents?: () => void
  unavailable: boolean
}

/**
 * Pricing component for the product.
 * @param product
 * @param purchased
 * @param userId - If user is logged in, this is the user's ID.
 * @param index
 * @param couponId
 * @constructor
 */
export const Pricing: React.FC<React.PropsWithChildren<PricingProps>> = ({
  product,
  purchased = false,
  userId,
  index = 0,
  couponId,
  allowPurchase = false,
  unavailable = false,
}) => {
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
    summary,
  } = product
  const {addPrice, isDowngrade, merchantCoupon, setMerchantCoupon} =
    usePriceCheck()
  // const {subscriber, loadingSubscriber} = useConvertkit()
  // const router = useRouter()

  const {data: formattedPrice, status} = trpc.pricing.formatted.useQuery(
    {
      productId,
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

  // const defaultCoupon = formattedPrice?.defaultCoupon
  const appliedMerchantCoupon = formattedPrice?.appliedMerchantCoupon

  // DON'T DELETE IT!!!
  const pppCoupon = getFirstPPPCoupon(
    formattedPrice?.availableCoupons,
    merchantCoupon,
  )
  // const pppCoupon = {
  //   id: 'kcd_8c0e64f6-0082-4775-a161-96b6e5732696',
  //   status: 1,
  //   merchantAccountId: 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e',
  //   percentageDiscount: 0.65,
  //   type: 'ppp',
  //   country: 'UA',
  // }

  const showPPPBox = (() => {
    // Cannot have already purchased and purchase of this product must be enabled
    const allowedToPurchase = !purchased && (allowPurchase || isSellingLive)

    // Ensure a valid PPP coupon is present
    const pppCouponIsPresent = Boolean(pppCoupon)

    // PPP is only valid for individual purchases (not team) and cannot be a downgrade
    const canBePurchasedWithPPPDiscount =
      !isDowngrade(formattedPrice) && !isBuyingForTeam

    return (
      allowedToPurchase && pppCouponIsPresent && canBePurchasedWithPPPDiscount
    )
  })()

  // const handleOnSuccess = (subscriber: any, email?: string) => {
  //   if (subscriber) {
  //     const redirectUrl = redirectUrlBuilder(subscriber, router.asPath, {
  //       confirmToast: 'true',
  //     })
  //     // email && setUserId(email)
  //     track('subscribed to email list', {
  //       location: 'pricing',
  //     })
  //     router.push(redirectUrl).then(() => {
  //       router.reload()
  //     })
  //   }
  // }

  const {data: purchaseToUpgrade} = trpc.purchases.getPurchaseById.useQuery({
    purchaseId: formattedPrice?.upgradeFromPurchaseId,
  })

  const isRestrictedUpgrade =
    purchaseToUpgrade?.status === 'Restricted' &&
    appliedMerchantCoupon &&
    appliedMerchantCoupon.type !== 'ppp'

  const fixedDiscount = formattedPrice?.fixedDiscountForUpgrade || 0

  return (
    <div
      data-pricing-component
      data-pricing-product-name={product.name}
      data-product-unavailable={unavailable}
    >
      {image && (
        <div data-pricing-image-container>
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
          <div data-product-price-holder>
            {title && (
              <h2 className="font-tt-regular uppercase text-base text-zinc-500 text-center tracking-wider">
                {title}
              </h2>
            )}
            <PriceDisplay status={status} formattedPrice={formattedPrice} />
            {formattedPrice?.upgradeFromPurchaseId &&
              !isRestrictedUpgrade &&
              fixedDiscount > 0 && (
                <div className="mt-1 text-center font-tt-medium">
                  <div className="text-xl">Upgrade Pricing</div>
                  <div className="text-tjs-orange">
                    $
                    {`${formatUsd(fixedDiscount).dollars}.${
                      formatUsd(fixedDiscount).cents || '00'
                    } credit applied`}
                  </div>
                </div>
              )}
            {/* <div data-byline="">Full access</div> */}
            {/* {(isSellingLive || allowPurchase) && (
              <SaleCountdown
                data-pricing-product-sale-countdown=""
                coupon={defaultCoupon}
              />
            )} */}
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
              {!unavailable && (
                <div className="flex flex-col justify-center">
                  <BuyMoreSeats
                    productName={name}
                    productId={productId}
                    userId={userId as string}
                  />
                </div>
              )}
            </div>
          </>
        ) : isSellingLive || allowPurchase ? (
          isDowngrade(formattedPrice) ? (
            <div data-downgrade-container="">
              <div data-downgrade="">Unavailable</div>
            </div>
          ) : unavailable ? null : (
            <div className="mt-4">
              <form
                action={buildStripeCheckoutPath({
                  userId,
                  quantity,
                  productId: formattedPrice?.id,
                  bulk: isBuyingForTeam,
                  couponId: appliedMerchantCoupon?.id,
                  upgradeFromPurchaseId: formattedPrice?.upgradeFromPurchaseId,
                })}
                method="POST"
              >
                <fieldset>
                  <legend className="sr-only">{name}</legend>
                  <div className="flex items-center justify-center gap-2 pb-3.5 text-base">
                    <label htmlFor="team-switch" className="sr-only">
                      Buying for myself or for my team
                    </label>
                    <button
                      role="button"
                      type="button"
                      onClick={() => {
                        setIsBuyingForTeam(false)
                        setQuantity(1)
                      }}
                      className="text-gray-700 decoration-gray-600 underline-offset-2 transition hover:underline"
                    >
                      For myself
                    </button>
                    <Switch.Root
                      aria-label={
                        isBuyingForTeam ? 'For my team' : 'For myself'
                      }
                      onCheckedChange={() => {
                        setIsBuyingForTeam(!isBuyingForTeam)
                        setMerchantCoupon(undefined)
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
                        setMerchantCoupon(undefined)
                        setQuantity(5)
                      }}
                    >
                      For my team
                    </button>
                  </div>
                  {isBuyingForTeam && (
                    <div className="mb-5 flex w-full flex-col items-center justify-center">
                      <div className="flex items-center justify-center gap-1 text-lg font-tt-medium">
                        <label className="opacity-70 flex items-center space-x-3">
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
                            className="max-w-[70px] rounded-md border border-gray-200 bg-gray-200/60 py-2 pl-3 font-mono font-bold ring-blue-500"
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
                    </div>
                  )}
                  <button
                    data-pricing-product-checkout-button={product.name}
                    type="submit"
                    disabled={status === 'loading' || status === 'error'}
                  >
                    <span>
                      {formattedPrice?.upgradeFromPurchaseId
                        ? `Upgrade Now`
                        : action || `Buy Now`}
                    </span>
                  </button>
                </fieldset>
              </form>
            </div>
          )
        ) : null}
        {unavailable && (
          <div data-product-unavailable-message>Not Available</div>
        )}
        {summary && (
          <div data-product-summary-holder className="mt-6">
            <PortableText value={summary} />
          </div>
        )}
        {showPPPBox && (
          <RegionalPricingBox
            pppCoupon={pppCoupon}
            activeCoupon={merchantCoupon}
            setActiveCoupon={setMerchantCoupon}
            index={index}
          />
        )}
        <div data-product-details-holder className="mt-6">
          {modules && (
            <>
              <h4 className="font-tt-demibold">Workshops</h4>
              <ul className="text-lg space-y-2 mt-1" role="list">
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
                    <li key={module.title} className="flex">
                      {module.image && (
                        <div
                          className="relative top-0.5 z-10 w-8 h-8 shrink-0 mr-3"
                          aria-hidden="true"
                        >
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
              <h4 className="font-tt-demibold mt-6 md:mt-10">Features</h4>
              <ul className="leading-snug space-y-3 mt-1" role="list">
                {features.map((feature: any) => {
                  return (
                    <li key={feature.value} className="flex">
                      <Icon
                        name="check-circle"
                        className="w-5 h-5 mr-2 shrink-0 mt-1 text-tjs-green"
                      />
                      <p
                        className={cx({
                          'font-tt-demibold': feature.isEmphasized,
                        })}
                      >
                        {feature.value}
                      </p>
                    </li>
                  )
                })}
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

  const fullPrice = formattedPrice?.fullPrice

  const percentOff = appliedMerchantCoupon
    ? Math.floor(+appliedMerchantCoupon.percentageDiscount * 100)
    : formattedPrice && isDiscount(formattedPrice)
    ? Math.floor(
        (formattedPrice.calculatedPrice / formattedPrice.unitPrice) * 100,
      )
    : 0

  const percentOffLabel =
    appliedMerchantCoupon && `${percentOff}% off of $${fullPrice}`

  return (
    <div className="flex justify-center mt-6">
      {status === 'loading' ? (
        <div className="flex items-center justify-center min-h-[60px]">
          <span className="sr-only">Loading price</span>
          <Spinner aria-hidden="true" className="h-8 w-8" />
        </div>
      ) : (
        <>
          <div
            aria-live="polite"
            className="flex items-center text-6xl font-tt-demibold"
          >
            <span
              aria-hidden="true"
              className="text-base font-tt-regular opacity-60"
            >
              USD
            </span>
            <span aria-hidden="true" className="mx-1 text-2xl opacity-60">
              $
            </span>
            {formattedPrice?.calculatedPrice &&
              formatUsd(formattedPrice?.calculatedPrice).dollars}
            <span className="sup text-sm" aria-hidden="true">
              {formattedPrice?.calculatedPrice &&
                formatUsd(formattedPrice?.calculatedPrice).cents}
            </span>
            {Boolean(appliedMerchantCoupon || isDiscount(formattedPrice)) && (
              <div className="ml-2">
                <div aria-hidden="true" className="text-xl leading-none">
                  <div className="line-through">
                    {'$' + fullPrice}
                    <span className="sup">{formatUsd(fullPrice).cents}</span>
                  </div>
                  <div className="text-red-500">Save {percentOff}%</div>
                </div>
                <div className="sr-only">
                  {appliedMerchantCoupon?.type === 'bulk' ? (
                    <div>Team discount.</div>
                  ) : null}{' '}
                  {percentOffLabel}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

type RegionalPricingBoxProps = {
  pppCoupon: MinimalMerchantCoupon | undefined
  activeCoupon: any
  setActiveCoupon: (coupon: MinimalMerchantCoupon | undefined) => void
  index: number
}

const RegionalPricingBox: React.FC<
  React.PropsWithChildren<RegionalPricingBoxProps>
> = ({pppCoupon, activeCoupon, setActiveCoupon, index}) => {
  const regionNames = new Intl.DisplayNames(['en'], {type: 'region'})

  if (!pppCoupon?.country) {
    console.error('No country found for PPP coupon', {pppCoupon})
    return null
  }

  const countryCode = pppCoupon.country
  const country = regionNames.of(countryCode)
  const percentOff = Math.floor(+pppCoupon.percentageDiscount * 100)

  return (
    <div className="bg-gray-100 p-5 my-4">
      <div data-ppp-header="">
        <strong>
          We noticed that you're from{' '}
          <img
            src={`https://hardcore-golick-433858.netlify.app/image?code=${countryCode}`}
            alt={`${country} flag`}
            className="w-[18px] h-[14px] inline-block"
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
      <label className="text-sm">
        <input
          type="checkbox"
          checked={Boolean(activeCoupon)}
          onChange={() => {
            activeCoupon
              ? setActiveCoupon(undefined)
              : setActiveCoupon(pppCoupon)
          }}
          className="relative top-0.5 mr-2"
        />
        <span>Activate {percentOff}% off with regional pricing</span>
      </label>
    </div>
  )
}
