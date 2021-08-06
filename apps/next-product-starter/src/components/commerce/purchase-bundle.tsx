import React from 'react'
import {SellableResource, Price, Coupon} from '@types'
import Countdown from 'components/commerce/countdown'
import ParityCouponMessage from 'components/commerce/parity-coupon-message'
import StripeCheckout, {StripeCheckoutProps} from 'react-stripe-checkout'
import {useViewer} from 'contexts/viewer-context'
import {motion} from 'framer-motion'
import {isEmpty, get, find, noop} from 'lodash'
import Spinner from 'components/spinner'
import {useConvertkit, useCommerceMachine} from '@skillrecordings/core'

// problem with `react-stripe-checkout` not having these types
// https://github.com/azmenak/react-stripe-checkout/pull/152
interface StripeCheckoutPropsExtended extends StripeCheckoutProps {
  children: any
  opened?: (this: StripeCheckoutProps, ...args: any[]) => void
  closed?: (this: StripeCheckoutProps, ...args: any[]) => void
}

const StripeCheckoutExtended = ({
  token,
  stripeKey,
  ...rest
}: StripeCheckoutPropsExtended) => (
  <StripeCheckout token={token} stripeKey={stripeKey} {...rest} />
)

type PurchaseButtonProps = {
  purchasing?: boolean
  children?: string
  bundle: SellableResource
  isProPackage: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const PurchaseButton = ({
  purchasing,
  children,
  bundle,
  onClick,
  isProPackage,
}: PurchaseButtonProps) => {
  return (
    <button
      disabled={purchasing}
      className={`flex text-center justify-center px-16 py-4 mx-auto font-semibold rounded-lg ${
        isProPackage
          ? 'dark:bg-white dark:text-black bg-black text-white'
          : 'dark:bg-white dark:text-black bg-black text-white'
      }`}
      aria-describedby={`${bundle.title} Tier`}
      onClick={onClick}
    >
      {purchasing ? <Spinner /> : children}
    </button>
  )
}

const dollarsToCents = (dollars: number | string) =>
  typeof dollars === 'string' ? 0 : dollars * 100

type PurchaseBundleProps = {
  bundle: SellableResource
  upgradeFromSellable?: SellableResource
  purchasingOtherPackage?: boolean
  setPurchasingPackage?: (bundleSlug?: string) => void
  stripeCheckoutV1Enabled?: boolean
}
const PurchaseBundle = ({
  bundle,
  upgradeFromSellable,
  purchasingOtherPackage = false,
  setPurchasingPackage = noop,
  stripeCheckoutV1Enabled = false,
}: PurchaseBundleProps) => {
  const [state, send] = useCommerceMachine({
    sellable: bundle,
    upgradeFromSellable,
  })
  const {viewer} = useViewer()
  const [planType, setPlanType] = React.useState<'individual' | 'team'>(
    'individual',
  )
  const [isPPP, setIsPPP] = React.useState(false)
  const {subscriber} = useConvertkit()
  const isProPackage = bundle.slug === process.env.NEXT_PUBLIC_PRO_SLUG

  const isPurchasing =
    state.matches('stripePurchase') ||
    state.matches('handlePurchase') ||
    state.matches('success')
  const bundleSlug = bundle.slug

  React.useEffect(() => {
    if (isPurchasing) {
      setPurchasingPackage(bundleSlug)
    } else {
      setPurchasingPackage()
    }
  }, [isPurchasing, bundleSlug, setPurchasingPackage])

  // React.useEffect(() => {
  //   if (
  //     teamAvailable &&
  //     subscriber?.fields?.job_title === 'manager' &&
  //     planType != 'team'
  //   ) {
  //     activateTeamPlan()
  //   }
  //   // don't want this to update until a subscriber loads and not again after that
  // }, [subscriber])

  if (isEmpty(bundle)) {
    return null
  }

  const availableCoupons = state?.context?.price?.available_coupons || []
  const parityCoupon = find(availableCoupons, {
    coupon_region_restricted: true,
  }) as Coupon
  const countryCode = get(parityCoupon, 'coupon_region_restricted_to')
  const countryName = get(parityCoupon, 'coupon_region_restricted_to_name')
  const displayParityCouponOffer =
    !(isEmpty(countryName) || isEmpty(countryCode) || isEmpty(parityCoupon)) ||
    (state.context.quantity && state.context.quantity > 1)

  const onApplyParityCoupon = () => {
    setIsPPP(true)
    send('APPLY_COUPON', {appliedCoupon: parityCoupon.coupon_code})
  }

  const onDismissParityCoupon = () => {
    setIsPPP(false)
    send('DISMISS_COUPON')
  }

  const setQuantity = ({quantity, bulk}: {quantity: number; bulk: boolean}) => {
    send('SET_QUANTITY', {quantity, bulk})
  }

  // these are used if we display a toggle for team plan
  // delete if design doesnt require them
  const setTeamQuantity = ({quantity}: {quantity: number}) => {
    setQuantity({quantity, bulk: true})
  }

  const activateIndividualPlan = () => {
    setQuantity({quantity: 1, bulk: false})
    setPlanType('individual')
  }

  const activateTeamPlan = () => {
    setTeamQuantity({quantity: 5})
    setPlanType('team')
    setIsPPP(false)
  }

  const createStripeSession = () => {
    send('START_STRIPE_CHECKOUT')
  }

  const onStripeToken = ({id, email}: {id: string; email: string}) => {
    send('HANDLE_PURCHASE', {stripeToken: id, email})
  }

  const onOpenStripePurchase = () => {
    send('START_PURCHASE')
  }

  const onCloseStripePurchase = () => {
    send('CANCEL_PURCHASE')
  }

  const currentPrice = state.context?.price?.price
  const fullPrice = state.context?.price?.full_price
  const displayPrice = currentPrice ? currentPrice : '--'
  const displayFullPrice = fullPrice ? fullPrice : '--'

  const getPercentOff = ({
    price,
    quantity,
  }: {
    price?: Price
    quantity?: number
  }) => {
    if (!price) return
    if (isEmpty(price.bulk_discount) && isEmpty(price.coupon)) {
      return
    }
    const fractionOff =
      quantity === 1
        ? Number(price.coupon.coupon_discount)
        : Number(price.bulk_discount)

    if (fractionOff) {
      return fractionOff * 100
    }
  }

  const displayPercentOff = getPercentOff({
    price: state.context.price,
    quantity: state.context.quantity,
  })

  const isDiscounted =
    (state.context.quantity && state.context.quantity > 4) || displayPercentOff

  const expiresAt =
    Number(state.context?.price?.coupon?.coupon_expires_at) * 1000 || false

  const getPurchaseButtonText = () => {
    if (state.matches('purchasing')) {
      return 'Purchasing...'
    } else if (planType === 'team') {
      return 'Level Up Your Team'
    } else if (isProPackage) {
      return 'Buy Now'
    } else {
      return 'Buy Now'
    }
  }

  const disablePurchaseButton =
    state.matches('handlePurchase') ||
    state.matches('success') ||
    state.matches('loadingStripeCheckoutSession') ||
    purchasingOtherPackage

  const teamAvailable = isEmpty(upgradeFromSellable)

  return (
    <>
      <div className="text-center space-y-5">
        <div>
          <h2 className="text-3xl font-bold" id={`tier-${bundle.title}`}>
            {bundle.title}
          </h2>
          <h4>{bundle.description}</h4>
        </div>
        {state.context.error && (
          <div className="w-full bg-rose-100 dark:bg-rose-500 text-rose-800 dark:text-rose-50 p-4 mt-4 rounded-md">
            <h4 className=" w-full text-center">
              There was an error processing your card.{' '}
              <strong>{state.context.error}</strong>. Please contact your bank.
              Reload the page to try another card.
            </h4>
          </div>
        )}
        {expiresAt && !isPPP && <Countdown date={expiresAt} />}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center">
            <div>
              <span className="align-top">$</span>
              <span className="text-4xl font-semibold tabular-nums">
                {displayPrice}
              </span>
            </div>
            {isDiscounted && (
              <div className="text-sm text-left leading-tight pl-1 flex flex-col">
                <del>
                  $
                  {typeof displayFullPrice === 'number' &&
                    displayFullPrice * (state.context.quantity || 1)}
                </del>
                {displayPercentOff && (
                  <strong>Save {displayPercentOff}%</strong>
                )}
              </div>
            )}
          </div>
          <div className="text-sm opacity-70">yours forever</div>
        </div>
        {isEmpty(upgradeFromSellable) && (
          <div className="flex justify-center">
            <div className="flex space-x-2 items-center">
              <label htmlFor="quantity" className="text-sm">
                Quantity
              </label>
              <input
                value={state.context.quantity}
                onChange={event => {
                  const newQuantity = Number(event.target.value)
                  const isBulk = newQuantity > 1
                  if (isBulk) {
                    setIsPPP(false)
                  }
                  setQuantity({quantity: newQuantity, bulk: isBulk})
                }}
                className="border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white"
                name="quantity"
                type="number"
                min="1"
                max="1000"
              />
            </div>
          </div>
        )}

        <div>
          {stripeCheckoutV1Enabled && (
            <StripeCheckoutExtended
              email={get(viewer, 'email')}
              allowRememberMe={false}
              ComponentClass={'div'}
              currency={'USD'}
              locale={'en'}
              panelLabel={'Pay'}
              triggerEvent={'onClick'}
              zipCode={false}
              token={onStripeToken}
              opened={onOpenStripePurchase}
              closed={onCloseStripePurchase}
              name={bundle.title}
              description={bundle.description}
              amount={dollarsToCents(displayPrice)}
              stripeKey={
                process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
              }
              image={bundle.square_cover_480_url}
            >
              <PurchaseButton isProPackage={isProPackage} bundle={bundle}>
                {getPurchaseButtonText()}
              </PurchaseButton>
            </StripeCheckoutExtended>
          )}
          {!stripeCheckoutV1Enabled &&
            (disablePurchaseButton ? (
              <PurchaseButton
                purchasing
                isProPackage={isProPackage}
                bundle={bundle}
              >
                Navigating to checkout...
              </PurchaseButton>
            ) : (
              <PurchaseButton
                onClick={createStripeSession}
                isProPackage={isProPackage}
                bundle={bundle}
              >
                {getPurchaseButtonText()}
              </PurchaseButton>
            ))}
        </div>

        {/* {teamAvailable && (
          <motion.div layout className="mt-10 flex justify-center w-full">
            <TeamPlanToggle
              planType={planType}
              activateIndividualPlan={activateIndividualPlan}
              activateTeamPlan={activateTeamPlan}
            />
          </motion.div>
        )} */}

        {isProPackage &&
          displayParityCouponOffer &&
          state.context.quantity === 1 &&
          !isEmpty(parityCoupon) &&
          planType === 'individual' && (
            <div className="pb-5 max-w-screen-sm mx-auto">
              <ParityCouponMessage
                coupon={parityCoupon}
                countryName={countryName}
                onApply={onApplyParityCoupon}
                onDismiss={onDismissParityCoupon}
                isPPP={isPPP}
              />
            </div>
          )}
      </div>
    </>
  )
}

type FeatureProps = {
  children: string | JSX.Element
  size?: 'normal' | 'large'
  className?: string
}

const Feature = ({children, size = 'normal', className = ''}: FeatureProps) => {
  const sizes = {
    normal: 'text-base',
    large: 'text-xl',
  }

  return (
    <li className={`flex items-center justify-start ${className}`}>
      <p
        className={`px-4 ${sizes[size]} leading-6 font-large text-gray-700 py-2`}
      >
        {children}
      </p>
    </li>
  )
}

export default PurchaseBundle
