import * as React from 'react'
import {usePriceCheck} from './pricing-check-context'
import type {
  SanityProduct,
  FormattedPrice,
  SanityProductModule,
  MinimalMerchantCoupon,
} from '@skillrecordings/commerce-server/dist/@types'
import {CheckCircleIcon} from '@heroicons/react/outline'
import {useDebounce} from '@skillrecordings/react'
import {QueryStatus} from '@tanstack/react-query'
import SaleCountdown from './sale-countdown'
import Spinner from '../spinner'
import Image from 'next/legacy/image'
import find from 'lodash/find'
import {type Decimal} from '@skillrecordings/database'
import ReactMarkdown from 'react-markdown'
import {isSellingLive} from '../utils/is-selling-live'
import {MailIcon} from '@heroicons/react/solid'
import {redirectUrlBuilder, SubscribeToConvertkitForm} from '../convertkit'
import {useConvertkit} from '../hooks/use-convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '../utils/analytics'
import {useRouter} from 'next/router'
import * as Switch from '@radix-ui/react-switch'
import Link from 'next/link'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import Balancer from 'react-wrap-balancer'
import BuyMoreSeats from '../team/buy-more-seats'
import first from 'lodash/first'
import {AnimatePresence, motion} from 'framer-motion'
import {buildStripeCheckoutPath} from '../utils/build-stripe-checkout-path'
import Countdown from 'react-countdown'

const getNumericValue = (
  value: string | number | Decimal | undefined,
): number => {
  if (typeof value === 'string') {
    return Number(value)
  } else if (typeof value === 'number') {
    return value
  } else if (typeof value?.toNumber === 'function') {
    return value.toNumber()
  } else {
    return 0
  }
}

type PricingProps = {
  product: SanityProduct
  purchased?: boolean
  userId?: string
  index?: number
  couponId?: string
  couponFromCode?: {
    merchantCouponId: string | null
    percentageDiscount: number | Decimal
  }
  cancelUrl?: string
  allowPurchase?: boolean
  canViewRegionRestriction?: boolean
  bonuses?: {
    title: string
    slug: string
    description?: string
    image?: string
    expiresAt?: string
  }[]
  purchaseButtonRenderer?: (
    formattedPrice: any,
    product: SanityProduct,
    status: QueryStatus,
  ) => React.ReactNode
  options?: {
    withImage?: boolean
    withGuaranteeBadge?: boolean
    isPPPEnabled?: boolean
    teamQuantityLimit?: number
    saleCountdownRenderer?: ({coupon}: {coupon: any}) => React.ReactNode
  }
  id?: string
}

/**
 * Pricing component for the product.
 * @param product
 * @param purchased
 * @param userId - If user is logged in, this is the user's ID.
 * @param index
 * @param couponId
 * @param couponFromCode
 * @param bonuses - Product Bonus (non-module)
 * @constructor
 */
export const Pricing: React.FC<React.PropsWithChildren<PricingProps>> = ({
  product,
  purchased = false,
  userId,
  index = 0,
  bonuses,
  couponId,
  couponFromCode,
  allowPurchase: generallyAllowPurchase = false,
  canViewRegionRestriction = false,
  cancelUrl,
  id = 'main-pricing',
  purchaseButtonRenderer = (formattedPrice, product, status) => {
    return (
      <button
        data-pricing-product-checkout-button=""
        type="submit"
        disabled={status === 'loading' || status === 'error'}
      >
        <span>
          {formattedPrice?.upgradeFromPurchaseId
            ? `Upgrade Now`
            : product?.action || `Buy Now`}
        </span>
      </button>
    )
  },
  options = {
    withImage: true,
    isPPPEnabled: false,
    withGuaranteeBadge: true,
    saleCountdownRenderer: () => null,
    teamQuantityLimit: 100,
  },
}) => {
  const {withImage, isPPPEnabled, withGuaranteeBadge, teamQuantityLimit} =
    options
  const {
    addPrice,
    isDowngrade,
    merchantCoupon,
    setMerchantCoupon,
    quantity,
    setQuantity,
  } = usePriceCheck()
  const [isBuyingForTeam, setIsBuyingForTeam] = React.useState(false)
  const debouncedQuantity: number = useDebounce<number>(quantity, 250)
  const {productId, name, image, modules, features, lessons, action, title} =
    product
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()
  const [autoApplyPPP, setAutoApplyPPP] = React.useState<boolean>(true)

  const {data: formattedPrice, status} =
    trpcSkillLessons.pricing.formatted.useQuery(
      {
        productId,
        quantity: debouncedQuantity,
        couponId,
        merchantCoupon,
        autoApplyPPP,
      },
      {
        onSuccess: (formattedPrice) => {
          addPrice(formattedPrice, productId)
        },
      },
    )

  const {data: purchaseToUpgrade} =
    trpcSkillLessons.purchases.getPurchaseById.useQuery({
      purchaseId: formattedPrice?.upgradeFromPurchaseId,
    })

  const defaultCoupon = formattedPrice?.defaultCoupon
  const appliedMerchantCoupon = formattedPrice?.appliedMerchantCoupon

  const allowPurchaseWithSpecialCoupon = Boolean(
    appliedMerchantCoupon &&
      appliedMerchantCoupon.type === 'special' &&
      appliedMerchantCoupon.id === couponFromCode?.merchantCouponId,
  )

  const allowPurchaseWith: {[key: string]: boolean} = {
    pppCoupon: generallyAllowPurchase,
    specialCoupon: allowPurchaseWithSpecialCoupon,
  }

  const allowPurchase =
    generallyAllowPurchase || Object.values(allowPurchaseWith).some(Boolean)

  const isRestrictedUpgrade =
    purchaseToUpgrade?.status === 'Restricted' &&
    appliedMerchantCoupon &&
    appliedMerchantCoupon.type !== 'ppp'

  type AvailableCoupon = NonNullable<
    typeof formattedPrice
  >['availableCoupons'][0]
  const availablePPPCoupon = getFirstPPPCoupon<AvailableCoupon>(
    formattedPrice?.availableCoupons,
  )

  const appliedPPPCoupon =
    appliedMerchantCoupon?.type === 'ppp' ? appliedMerchantCoupon : null

  // if there is no available coupon, hide the box (it's not a toggle)
  // only show the box if ppp coupon is available
  // do not show the box if purchased
  // do not show the box if it's a downgrade
  const showPPPBox =
    Boolean(availablePPPCoupon || appliedPPPCoupon) &&
    !purchased &&
    !isDowngrade(formattedPrice) &&
    !isBuyingForTeam &&
    allowPurchaseWith.pppCoupon

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

  const workshops = modules?.filter(
    (module) => module.moduleType === 'workshop',
  )
  const moduleBonuses = modules?.filter(
    (module) => module.moduleType === 'bonus' && module.state === 'published',
  )

  function getUnitPrice(formattedPrice: FormattedPrice) {
    const price = first(formattedPrice?.upgradedProduct?.prices)
    return getNumericValue(price?.unitAmount)
  }

  const fixedDiscount = formattedPrice?.fixedDiscountForUpgrade || 0

  const [isBuyingMoreSeats, setIsBuyingMoreSeats] = React.useState(false)

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div id={id}>
      <div data-pricing-product={index}>
        {withImage && image && (
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
          {(isSellingLive || allowPurchase) && !purchased ? (
            <div data-pricing-product-header="">
              <p data-name-badge="">{name}</p>
              {title && (
                <h2 data-title>
                  <Balancer>{title}</Balancer>
                </h2>
              )}
              <PriceDisplay status={status} formattedPrice={formattedPrice} />
              {isRestrictedUpgrade ? (
                <div data-byline="">All region access</div>
              ) : (
                <div data-byline="">
                  {appliedMerchantCoupon?.type === 'ppp'
                    ? 'Regional access'
                    : formattedPrice?.upgradeFromPurchaseId
                    ? `Upgrade Pricing`
                    : 'Full access'}
                </div>
              )}
              {formattedPrice?.upgradeFromPurchaseId &&
                !isRestrictedUpgrade &&
                fixedDiscount > 0 && (
                  <div data-byline="">
                    {`${formatUsd(fixedDiscount).dollars}.${
                      formatUsd(fixedDiscount).cents
                    } credit applied`}
                  </div>
                )}
            </div>
          ) : null}
          {options.saleCountdownRenderer
            ? options.saleCountdownRenderer({
                coupon:
                  Number(couponFromCode?.percentageDiscount) >=
                  Number(defaultCoupon?.percentageDiscount)
                    ? couponFromCode
                    : defaultCoupon,
              })
            : null}
          {purchased ? (
            <>
              <div data-pricing-product-header="">
                <p data-name-badge="">{name}</p>
                {title && (
                  <h2 data-title>
                    <Balancer>{title}</Balancer>
                  </h2>
                )}
              </div>
              <div data-purchased-container="">
                <div data-purchased="">
                  <CheckCircleIcon aria-hidden="true" /> Purchased
                </div>
                <div
                  data-buy-more-seats={
                    isBuyingMoreSeats ? 'active' : 'inactive'
                  }
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsBuyingMoreSeats(!isBuyingMoreSeats)
                    }}
                  >
                    {isBuyingMoreSeats ? '← Back' : 'Buy more seats'}
                  </button>
                  <AnimatePresence>
                    {isBuyingMoreSeats && (
                      <motion.div
                        initial={{x: '100%', opacity: 0}}
                        animate={{x: '0%', opacity: 1}}
                        exit={{x: '-100%', opacity: 0}}
                        transition={{}}
                      >
                        <BuyMoreSeats
                          productId={productId}
                          userId={userId as string}
                          buttonLabel="Buy more seats"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  action={buildStripeCheckoutPath({
                    productId: formattedPrice?.id,
                    couponId: appliedMerchantCoupon?.id,
                    bulk: isBuyingForTeam,
                    quantity,
                    userId,
                    upgradeFromPurchaseId:
                      formattedPrice?.upgradeFromPurchaseId,
                    cancelUrl,
                    usedCouponId: formattedPrice?.usedCouponId,
                  })}
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
                        <div>
                          <label>Team Seats</label>
                          <button
                            type="button"
                            aria-label="decrease seat quantity by one"
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
                            max={teamQuantityLimit}
                            step={1}
                            onChange={(e) => {
                              const quantity = Number(e.target.value)
                              setMerchantCoupon(undefined)
                              setQuantity(
                                quantity < 1
                                  ? 1
                                  : teamQuantityLimit &&
                                    quantity > teamQuantityLimit
                                  ? teamQuantityLimit
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
                            onClick={() => {
                              if (quantity === 100) return
                              setQuantity(quantity + 1)
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {purchaseButtonRenderer(formattedPrice, product, status)}
                    {withGuaranteeBadge && (
                      <span data-guarantee="">30-Day Money-Back Guarantee</span>
                    )}
                  </fieldset>
                </form>
              </div>
            )
          ) : (
            <div data-purchased-container="">
              <div data-unavailable="">Coming Soon</div>
              <div
                data-description=""
                className="my-6 items-center text-base font-medium leading-tight"
              >
                {process.env.NEXT_PUBLIC_SITE_TITLE} is not available for
                purchase yet! We plan to launch in mid October 2023.
              </div>
              {!subscriber && !loadingSubscriber && (
                <SubscribeForm handleOnSuccess={handleOnSuccess} />
              )}
            </div>
          )}
          {!options.saleCountdownRenderer && (
            <>
              {(isSellingLive || allowPurchase) && !purchased && (
                <SaleCountdown
                  coupon={
                    Number(couponFromCode?.percentageDiscount) >=
                    Number(defaultCoupon?.percentageDiscount)
                      ? couponFromCode
                      : defaultCoupon
                  }
                  data-pricing-product-sale-countdown={index}
                />
              )}
            </>
          )}
          {showPPPBox &&
            !canViewRegionRestriction &&
            (isSellingLive || allowPurchase) && (
              <RegionalPricingBox
                availablePPPCoupon={availablePPPCoupon}
                appliedPPPCoupon={appliedPPPCoupon}
                setMerchantCoupon={setMerchantCoupon}
                index={index}
                setAutoApplyPPP={setAutoApplyPPP}
                purchaseToUpgradeExists={Boolean(purchaseToUpgrade)}
              />
            )}
          <div data-pricing-footer="">
            {product.description &&
              (isSellingLive || allowPurchase) &&
              !purchased && (
                <div className="prose prose-sm mx-auto max-w-sm px-5 sm:prose-base prose-p:text-gray-200">
                  <ReactMarkdown>{product.description}</ReactMarkdown>
                </div>
              )}
            {(isSellingLive || allowPurchase) &&
              !purchased &&
              withGuaranteeBadge && (
                <div data-guarantee-image="">
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
              {bonuses &&
                bonuses.length > 0 &&
                bonuses[0].expiresAt &&
                quantity === 1 &&
                !Boolean(merchantCoupon?.type === 'ppp') && (
                  <Countdown
                    date={bonuses[0].expiresAt}
                    renderer={({days, hours, minutes, seconds, completed}) => {
                      return completed ? null : (
                        <>
                          <div data-limited-bonuses="">
                            <strong>limited offer</strong>
                            <ul role="list">
                              {bonuses.map((bonus) => {
                                return (
                                  <li key={bonus.slug}>
                                    <LimitedBonusItem
                                      module={bonus as any}
                                      key={bonus.slug}
                                    />
                                  </li>
                                )
                              })}
                              <div data-expires-at="">
                                {mounted ? (
                                  <span>
                                    expires in: {days}d : {hours}h : {minutes}m
                                    : {seconds}s
                                  </span>
                                ) : null}
                              </div>
                              <div data-disclaimer="">
                                Offer available for new purchases only. If
                                you've already purchased both of the courses
                                this offer does not apply. If you've purchased 1
                                of the courses, you'll receive the other.
                              </div>
                            </ul>
                          </div>
                        </>
                      )
                    }}
                  />
                )}
              {moduleBonuses &&
                moduleBonuses.length > 0 &&
                !Boolean(merchantCoupon) && (
                  <div data-bonuses="">
                    <ul role="list">
                      {moduleBonuses.map((module) => {
                        return purchased ? (
                          <li key={module.slug}>
                            <Link
                              href={{
                                pathname: `/bonuses/[slug]`,
                                query: {
                                  slug: module.slug,
                                },
                              }}
                            >
                              <WorkshopListItem module={module} />
                            </Link>
                          </li>
                        ) : (
                          <li key={module.slug}>
                            <WorkshopListItem
                              module={module}
                              key={module.slug}
                            />
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              {workshops && (
                <div data-workshops="">
                  <strong>Workshops</strong>
                  <ul role="list">
                    {workshops.map((module) => {
                      return purchased ? (
                        <li key={module.slug}>
                          <Link
                            href={{
                              pathname: `/workshops/[slug]`,
                              query: {
                                slug: module.slug,
                              },
                            }}
                          >
                            <WorkshopListItem module={module} />
                          </Link>
                        </li>
                      ) : (
                        <li key={module.slug}>
                          <WorkshopListItem module={module} key={module.slug} />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {features && (
                <div data-features="">
                  <strong>Features</strong>
                  <ul role="list">
                    {features.map((feature: {value: string; icon?: string}) => (
                      <li key={feature.value}>
                        {feature.icon && (
                          <span
                            dangerouslySetInnerHTML={{__html: feature.icon}}
                          />
                        )}
                        <p>{feature.value}</p>
                      </li>
                    ))}
                  </ul>
                </div>
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
    </div>
  )
}

const WorkshopListItem: React.FC<{
  module: SanityProductModule
}> = ({module}) => {
  const getLabelForState = (state: any) => {
    switch (state) {
      case 'draft':
        return 'Coming soon'
      default:
        return ''
    }
  }
  return (
    <>
      {module.image?.url && (
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
        <p>
          {module.moduleType === 'bonus' && <strong>Bonus</strong>}

          {module.title}
        </p>
        {module.state && (
          <div data-state={module.state}>{getLabelForState(module.state)}</div>
        )}
        {module?.description && (
          <div data-description="">
            <ReactMarkdown
              components={{
                a: (props) => <a {...props} target="_blank" rel="noopener" />,
              }}
            >
              {module.description}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  )
}

const LimitedBonusItem: React.FC<{
  module: {
    image?: {
      url: string
    }
    expiresAt?: string
    title: string
    description?: string
  }
}> = ({module}) => {
  return (
    <>
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
        {module?.description && (
          <div data-description="">
            <ReactMarkdown
              components={{
                a: (props) => <a {...props} target="_blank" rel="noopener" />,
              }}
            >
              {module.description}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  )
}

export type PriceDisplayProps = {
  status: QueryStatus
  formattedPrice?: FormattedPrice
  className?: string
}

export const PriceDisplay = ({
  status,
  formattedPrice,
  className = '',
}: PriceDisplayProps) => {
  const {isDiscount} = usePriceCheck()

  const appliedMerchantCoupon = formattedPrice?.appliedMerchantCoupon

  const fullPrice = formattedPrice?.fullPrice

  const percentOff = appliedMerchantCoupon
    ? Math.floor(+appliedMerchantCoupon.percentageDiscount * 100)
    : formattedPrice && isDiscount(formattedPrice)
    ? Math.floor(
        ((formattedPrice.unitPrice - formattedPrice.calculatedPrice) /
          formattedPrice.unitPrice) *
          100,
      )
    : 0

  const percentOffLabel =
    appliedMerchantCoupon && `${percentOff}% off of $${fullPrice}`

  return (
    <div data-price-container={status} className={className}>
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
            <span className="sup text-sm" aria-hidden="true">
              {formattedPrice?.calculatedPrice &&
                formatUsd(formattedPrice?.calculatedPrice).cents}
            </span>
            {Boolean(appliedMerchantCoupon || isDiscount(formattedPrice)) && (
              <>
                <div aria-hidden="true" data-price-discounted="">
                  <div data-full-price={fullPrice}>{'$' + fullPrice}</div>
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
  availablePPPCoupon: {
    country?: string | undefined
    percentageDiscount: number | Decimal
  } | null
  appliedPPPCoupon: MinimalMerchantCoupon | null
  setMerchantCoupon: (coupon: any) => void
  index: number
  setAutoApplyPPP: (apply: boolean) => void
  purchaseToUpgradeExists: boolean
}

const RegionalPricingBox: React.FC<
  React.PropsWithChildren<RegionalPricingBoxProps>
> = ({
  availablePPPCoupon,
  appliedPPPCoupon,
  setMerchantCoupon,
  index,
  setAutoApplyPPP,
  purchaseToUpgradeExists,
}) => {
  const regionNames = new Intl.DisplayNames(['en'], {type: 'region'})

  if (!availablePPPCoupon?.country) {
    console.error('No country found for PPP coupon', {availablePPPCoupon})
    return null
  }

  const countryCode = availablePPPCoupon.country
  const country = regionNames.of(countryCode)
  const percentageDiscount = getNumericValue(
    availablePPPCoupon.percentageDiscount,
  )
  const percentOff = Math.floor(percentageDiscount * 100)

  // if we are upgrading a Core(PPP) to a Bundle(PPP) and the PPP coupon is
  // valid and auto-applied then we hide the checkbox to reduce confusion.
  const hideCheckbox = purchaseToUpgradeExists

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
        {!hideCheckbox && <p>If that is something that you need:</p>}
      </div>
      {!hideCheckbox && (
        <label>
          <input
            type="checkbox"
            checked={Boolean(appliedPPPCoupon)}
            onChange={() => {
              setAutoApplyPPP(false)
              if (appliedPPPCoupon) {
                setMerchantCoupon(undefined)
              } else {
                setMerchantCoupon(availablePPPCoupon as any)
              }
            }}
          />
          <span>Activate {percentOff}% off with regional pricing</span>
        </label>
      )}
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
      data-pricing-subscribing-form=""
      className="flex w-full max-w-sm flex-col items-center justify-between pb-8"
    >
      <div className="inline-flex max-w-xs flex-shrink-0 items-center gap-2 text-base font-medium leading-tight">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-800"
        >
          <MailIcon className="h-5 w-5 text-cyan-300" />
        </div>{' '}
        <Balancer>
          If you'd like to get notified and receive the best discounts, please
          subscribe below:
        </Balancer>
      </div>
      <SubscribeToConvertkitForm
        formId={Number(process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM)}
        actionLabel="Get Notified"
        onSuccess={(subscriber, email) => {
          return handleOnSuccess(subscriber, email)
        }}
      />
    </div>
  )
}

export function getFirstPPPCoupon<T extends {type: string | null} | undefined>(
  availableCoupons: T[] = [],
) {
  return find<T>(availableCoupons, (coupon) => coupon?.type === 'ppp') || null
}

export const formatUsd = (amount: number = 0) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const formattedPrice = formatter.format(amount).split('.')

  return {dollars: formattedPrice[0], cents: formattedPrice[1]}
}
