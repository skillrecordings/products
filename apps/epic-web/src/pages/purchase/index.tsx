import {buildStripeCheckoutPath} from '@skillrecordings/skill-lesson/utils/build-stripe-checkout-path'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {trpcSkillLessons} from '@skillrecordings/skill-lesson/utils/trpc-skill-lessons'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import React from 'react'
import {
  Pricing,
  formatUsd,
  getFirstPPPCoupon,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {getToken} from 'next-auth/jwt'
import {Product, getProduct} from 'lib/products'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import Image from 'next/image'
import Spinner from 'components/spinner'

type PurchaseSummaryProps = {
  product: Product
  productId: string
  quantity: string
  ppp: string
  code: string
}

export const getServerSideProps = async (context: any) => {
  const {req, query} = context
  const token = await getToken({req})
  const product = await getProduct(query.productId)

  return {
    props: {
      product,
    },
  }
}

const PurchasePage: React.FC<{product: Product}> = ({product}) => {
  const router = useRouter()
  const productId = router.query.productId as string
  const quantity = router.query.quantity as string
  const ppp = router.query.ppp as string
  const code = router.query.code as string
  const upgrade = product.upgradableTo && product.upgradableTo[0]
  const {data: commerceProps, status: propsForCommerceStatus} =
    trpcSkillLessons.pricing.propsForCommerce.useQuery({
      productId: productId,
      code: code,
    })
  const purchases = commerceProps?.purchases
  const userId = commerceProps?.userId
  const purchasedProductIds = purchases?.map((purchase) => purchase.productId)
  const upgradePurchased = purchasedProductIds?.includes(upgrade.productId)
  const couponFromCode = commerceProps?.couponFromCode
  const {validCoupon} = useCoupon(commerceProps?.couponFromCode)
  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? couponFromCode?.id : undefined)
  const ALLOW_UPGRADE =
    router.query.allowPurchase === 'true' || upgrade.state === 'active'

  return (
    <Layout meta={{title: `Purchase ${product.title}`}}>
      <header className="w-full px-5 py-10 dark:bg-foreground/5">
        <div className="mx-auto w-full max-w-screen-lg">
          <PriceCheckProvider>
            <PurchaseSummary
              product={product}
              productId={productId}
              quantity={quantity}
              ppp={ppp}
              code={code}
            />
          </PriceCheckProvider>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-screen-lg flex-col items-center px-5 py-16">
        <h2 className="text-center text-sm font-semibold uppercase text-amber-600 dark:text-amber-300">
          upgrade offer
        </h2>
        <h3 className="pt-5 text-center text-4xl font-semibold">
          Unlock Ultimate Value with {upgrade.title}
        </h3>
        <p className="max-w-xl pt-5 text-center text-lg opacity-75">
          {upgrade.description} Includes{' '}
          {
            upgrade.modules.filter(
              ({moduleType}: {moduleType: string}) => moduleType === 'workshop',
            ).length
          }{' '}
          self-paced workshops.
        </p>
        <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
          <div data-pricing-container="" className="mt-10">
            <Pricing
              // bonuses={bonuses}
              allowPurchase={ALLOW_UPGRADE}
              userId={userId}
              product={upgrade}
              purchased={upgradePurchased}
              couponId={couponId}
              couponFromCode={couponFromCode}
            />
          </div>
        </PriceCheckProvider>
      </main>
    </Layout>
  )
}

export default PurchasePage

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({
  product,
  productId,
  quantity,
  ppp,
  code,
}) => {
  const {addPrice, merchantCoupon, setMerchantCoupon} = usePriceCheck()

  const {data: commerceProps, status: propsForCommerceStatus} =
    trpcSkillLessons.pricing.propsForCommerce.useQuery({
      productId: productId,
      code: code,
    })
  const couponFromCode = commerceProps?.couponFromCode
  const {validCoupon} = useCoupon(commerceProps?.couponFromCode)
  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? couponFromCode?.id : undefined)
  const {data: formattedPrice, status} =
    trpcSkillLessons.pricing.formatted.useQuery(
      {
        productId: productId as string,
        quantity: Number(quantity) || 1,
        couponId,
        merchantCoupon,
      },
      {
        onSuccess: (formattedPrice) => {
          addPrice(formattedPrice, productId as string)
          if (ppp === 'true' && Number(quantity) === 1) {
            const availablePPPCoupon = getFirstPPPCoupon<any>(
              formattedPrice?.availableCoupons,
            )
            setMerchantCoupon(availablePPPCoupon)
          }
        },
      },
    )
  const {userId} = commerceProps || {}
  const router = useRouter()

  return (
    <div className="relative flex flex-col items-center justify-between gap-10 px-5 md:flex-row">
      <button
        onClick={() => {
          router.back()
        }}
        className="-top-6 left-5 text-sm opacity-75 transition hover:opacity-100 md:absolute"
      >
        ← Back
      </button>
      <div className="flex flex-col items-center gap-5 md:flex-row">
        {product?.image?.url && (
          <Image
            src={product.image.url}
            alt={product.image.alt || product.title}
            width={150}
            height={150}
          />
        )}
        <div className="text-center md:-mt-5 md:text-left">
          <span className="text-xs uppercase tracking-wider opacity-75">
            Summary
          </span>
          <h1 className="pt-3 text-2xl font-semibold">{product.title}</h1>
          <p>
            {quantity}×{' '}
            {ppp === 'true' && Number(quantity) === 1 ? 'Regional' : 'Full'}{' '}
            license
          </p>
        </div>
      </div>
      <form
        action={buildStripeCheckoutPath({
          productId: formattedPrice?.id,
          couponId: formattedPrice?.appliedMerchantCoupon?.id,
          bulk: Number(quantity) > 1,
          quantity: Number(quantity) || 1,
          userId,
          upgradeFromPurchaseId: formattedPrice?.upgradeFromPurchaseId,
          cancelUrl: process.env.NEXT_PUBLIC_URL + router.asPath,
          usedCouponId: formattedPrice?.usedCouponId,
        })}
        method="POST"
        className="flex w-full flex-col items-center gap-5 md:w-auto md:flex-row md:items-end"
      >
        {/* <pre>{formattedPrice && JSON.stringify(formattedPrice, null, 2)}</pre> */}
        {status === 'loading' ? (
          <Spinner />
        ) : (
          <span className="flex items-start gap-0.5 text-4xl">
            <sup className="text-sm opacity-75">US</sup>
            <span className="relative -translate-y-2 font-bold">
              {formatUsd(formattedPrice?.calculatedPrice).dollars}
            </span>
            <sup className="text-sm opacity-75">
              {formatUsd(formattedPrice?.calculatedPrice).cents}
            </sup>
          </span>
        )}
        <button
          className="flex w-full items-center justify-center rounded-md bg-gradient-to-t from-blue-600 to-blue-500 px-8 py-4 text-center font-semibold text-white shadow-lg ring-offset-1 transition ease-in-out hover:bg-blue-700 hover:shadow-gray-600/20 focus-visible:ring-blue-600 disabled:cursor-wait"
          disabled={status === 'loading'}
          type="submit"
        >
          Proceed to Checkout
        </button>
      </form>
    </div>
  )
}
