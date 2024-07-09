import {buildStripeCheckoutPath} from '@skillrecordings/skill-lesson/utils/build-stripe-checkout-path'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {trpcSkillLessons} from '@skillrecordings/skill-lesson/utils/trpc-skill-lessons'
import Layout from '@/components/app/layout'
import {useRouter} from 'next/router'
import React from 'react'
import {
  formatUsd,
  getFirstPPPCoupon,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {getToken} from 'next-auth/jwt'
import {Product, getProduct} from '@/lib/products'
import Image from 'next/image'
import pluralize from 'pluralize'
import {Skeleton} from '@skillrecordings/ui'

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
  const upgrade = product.upgradableTo
  const {data: commerceProps, status: propsForCommerceStatus} =
    trpcSkillLessons.pricing.propsForCommerce.useQuery({
      productId: productId,
      code: code,
    })
  const purchases = commerceProps?.purchases
  const userId = commerceProps?.userId
  const purchasedProductIds = purchases?.map((purchase) => purchase.productId)
  const upgradePurchased = purchasedProductIds?.includes(upgrade?.productId)
  const couponFromCode = commerceProps?.couponFromCode
  const {validCoupon} = useCoupon(commerceProps?.couponFromCode)
  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? couponFromCode?.id : undefined)

  return (
    <Layout
      meta={{title: `Purchase ${product.title}`}}
      className="py-16 sm:py-24"
    >
      <main className="mx-auto w-full max-w-screen-md px-5">
        <PriceCheckProvider>
          <UpsellPricingWidget
            code={code}
            ppp={ppp}
            quantity={quantity}
            individualProduct={product}
            upgradeProduct={upgrade}
          />
        </PriceCheckProvider>
      </main>
    </Layout>
  )
}

export default PurchasePage

const UpsellPricingWidget: React.FC<{
  individualProduct: Product
  upgradeProduct: Product
  code: string
  quantity: string
  ppp: string
}> = ({individualProduct, upgradeProduct, code, quantity, ppp}) => {
  const individualProductId = individualProduct.productId
  const upgradeProductId = upgradeProduct.productId

  const {addPrice, merchantCoupon, setMerchantCoupon} = usePriceCheck()

  const {
    data: individualProductCommerceProps,
    status: individualCommercePropsStatus,
  } = trpcSkillLessons.pricing.propsForCommerce.useQuery({
    productId: individualProductId,
    code: code,
  })

  const couponFromCode = individualProductCommerceProps?.couponFromCode

  const {validCoupon} = useCoupon(
    individualProductCommerceProps?.couponFromCode,
  )
  const couponId =
    individualProductCommerceProps?.couponIdFromCoupon ||
    (validCoupon ? couponFromCode?.id : undefined)

  const {
    data: individualProductFormattedPrice,
    status: individualProductFormattedPriceStatus,
  } = trpcSkillLessons.pricing.formatted.useQuery(
    {
      productId: individualProductId,
      quantity: Number(quantity) || 1,
      couponId,
      merchantCoupon,
    },
    {
      onSuccess: (formattedPrice) => {
        // we don't read price from context since we have multiple products with nested UI
        // addPrice(formattedPrice, individualProductId as string)

        // this can only happen once for one of the products and it'll apply globally
        if (ppp === 'true' && Number(quantity) === 1) {
          const availablePPPCoupon = getFirstPPPCoupon<any>(
            formattedPrice?.availableCoupons,
          )
          setMerchantCoupon(availablePPPCoupon)
        }
      },
    },
  )

  const {
    data: upgradeProductFormattedPrice,
    status: upgradeProductFormattedPriceStatus,
  } = trpcSkillLessons.pricing.formatted.useQuery({
    productId: upgradeProductId,
    quantity: Number(quantity) || 1,
    couponId,
    merchantCoupon,
  })
  const {userId} = individualProductCommerceProps || {}
  const router = useRouter()

  return (
    <div className="pt-16">
      <div className="flex items-center gap-3 border-b pb-3">
        {individualProduct?.image?.url && (
          <Image
            src={individualProduct.image.url}
            alt={individualProduct.image.alt || individualProduct.title}
            width={150}
            height={150}
            priority
          />
        )}
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium">{individualProduct.title}</h1>
          <div className="mt-2 inline-flex items-center gap-2">
            {individualProductFormattedPriceStatus === 'loading' ? (
              <Skeleton className="flex h-[28px] w-[80px] items-center justify-center bg-white/10 p-1">
                <Skeleton className="h-[14px] w-[80%] bg-white/10" />
              </Skeleton>
            ) : (
              <span className="flex w-[80px] items-center gap-0.5">
                <sup className="text-sm opacity-75">US</sup>
                <span className="relative text-xl font-semibold text-white">
                  {
                    formatUsd(individualProductFormattedPrice?.calculatedPrice)
                      .dollars
                  }
                </span>
                <sup className=" text-sm opacity-75">
                  {
                    formatUsd(individualProductFormattedPrice?.calculatedPrice)
                      .cents
                  }
                </sup>
              </span>
            )}
            <span>・</span>
            <p>
              {quantity}{' '}
              {ppp === 'true' && Number(quantity) === 1 ? 'Regional' : ''}{' '}
              {pluralize('Seat', Number(quantity))}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 pt-8 md:flex-row">
        <div className="flex w-full flex-shrink-0 flex-col items-center md:w-auto">
          {upgradeProduct?.image?.url && (
            <Image
              src={upgradeProduct.image.url}
              alt={upgradeProduct.image.alt || upgradeProduct.title}
              priority
              width={300}
              height={300}
            />
          )}
        </div>
        <div>
          <div>
            <h2 className="inline-flex flex-wrap items-center text-3xl font-semibold text-white">
              {upgradeProduct.title}{' '}
              <span className="ml-2 rounded bg-yellow-300 px-2 py-1 text-sm font-semibold text-yellow-900">
                Best Value
              </span>
            </h2>
            <div className="mt-2 flex w-full items-center gap-2">
              {upgradeProductFormattedPriceStatus === 'loading' ? (
                <Skeleton className="flex h-[36px] w-full max-w-[150px] items-center justify-center bg-white/10 p-1">
                  <Skeleton className="h-[18px] w-[80%] bg-white/10" />
                </Skeleton>
              ) : (
                <span className="flex w-full items-center gap-0.5">
                  <sup className="text-sm opacity-75">US</sup>
                  <span className="relative text-3xl font-semibold text-white">
                    {
                      formatUsd(upgradeProductFormattedPrice?.calculatedPrice)
                        .dollars
                    }
                  </span>
                  <sup className=" text-sm opacity-75">
                    {
                      formatUsd(upgradeProductFormattedPrice?.calculatedPrice)
                        .cents
                    }
                  </sup>
                </span>
              )}
            </div>
            {upgradeProduct.description && (
              <p className="mt-2">{upgradeProduct.description}</p>
            )}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <form
              action={buildStripeCheckoutPath({
                productId: upgradeProductFormattedPrice?.id,
                couponId:
                  upgradeProductFormattedPrice?.appliedMerchantCoupon?.id,
                bulk: Number(quantity) > 1,
                quantity: Number(quantity) || 1,
                userId,
                upgradeFromPurchaseId:
                  upgradeProductFormattedPrice?.upgradeFromPurchaseId,
                cancelUrl: process.env.NEXT_PUBLIC_URL + router.asPath,
                usedCouponId: upgradeProductFormattedPrice?.usedCouponId,
              })}
              method="POST"
              className="flex w-full flex-col items-center gap-5 md:w-auto md:flex-row md:items-end"
            >
              <button
                className="flex w-full items-center justify-center rounded-md bg-gradient-to-b from-cyan-300 to-cyan-400 px-5 py-4 text-center text-lg font-semibold text-gray-900 shadow-xl brightness-105 transition ease-in-out hover:brightness-110 focus-visible:ring-white disabled:cursor-wait"
                disabled={upgradeProductFormattedPriceStatus === 'loading'}
                type="submit"
              >
                Get the Full Bundle
              </button>
            </form>
            <form
              action={buildStripeCheckoutPath({
                productId: individualProductFormattedPrice?.id,
                couponId:
                  individualProductFormattedPrice?.appliedMerchantCoupon?.id,
                bulk: Number(quantity) > 1,
                quantity: Number(quantity) || 1,
                userId,
                upgradeFromPurchaseId:
                  individualProductFormattedPrice?.upgradeFromPurchaseId,
                cancelUrl: process.env.NEXT_PUBLIC_URL + router.asPath,
                usedCouponId: individualProductFormattedPrice?.usedCouponId,
              })}
              method="POST"
              className="flex w-full flex-col items-center gap-5 md:w-auto md:flex-row md:items-end"
            >
              <button
                className="flex w-full items-center justify-center rounded-md bg-white/5 px-5 py-4 text-center text-lg font-semibold text-foreground shadow-xl transition ease-in-out hover:bg-white/10 focus-visible:ring-white disabled:cursor-wait"
                disabled={individualProductFormattedPriceStatus === 'loading'}
                type="submit"
              >
                No thanks
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="pt-5 md:pt-0">
        <h3 className="mb-3 inline-flex text-lg font-medium">Includes</h3>
        <div className="flex flex-wrap gap-3">
          {upgradeProduct.modules?.map((workshop) => {
            return (
              <div className="inline-flex items-center gap-2">
                {workshop.image.url && (
                  <Image
                    src={workshop.image.url}
                    alt=""
                    width={60}
                    height={60}
                  />
                )}
                <span className="text-lg font-medium">
                  {workshop.title}{' '}
                  {workshop.moduleType === 'bonus' && '(bonus)'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
