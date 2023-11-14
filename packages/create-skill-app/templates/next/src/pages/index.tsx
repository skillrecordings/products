import React from 'react'
import Layout from '@/components/app/layout'
import type {GetStaticProps, NextPage} from 'next'
import LandingCopy from '@/text/landing-copy.mdx'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import Balancer from 'react-wrap-balancer'
import {useRouter} from 'next/router'
import {trpc} from '@/trpc/trpc.client'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {getProduct} from '@/lib/products'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {getAvailableBonuses} from '@/lib/available-bonuses'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'

const defaultProductId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

export const getStaticProps: GetStaticProps = async () => {
  const defaultProduct = await getProduct(defaultProductId as string)
  const products = await getAllProducts()
  const availableBonuses = await getAvailableBonuses()

  return {
    props: {
      defaultProduct,
      products,
      bonuses: availableBonuses,
    },
    revalidate: 10,
  }
}

const Home: NextPage<{
  defaultProduct?: SanityProduct
  products: SanityProduct[]
  bonuses: any[]
}> = ({defaultProduct, products, bonuses}) => {
  const router = useRouter()
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' || defaultProduct?.state === 'active'
  const {subscriber, loadingSubscriber} = useConvertkit()
  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      ...router.query,
      productId: defaultProduct?.productId,
    })

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
    {
      image: {
        url: 'https://res.cloudinary.com/epic-web/image/upload/v1695972887/coupon_2x.png',
        width: 132,
        height: 112,
      },
      title: defaultProduct?.title as string,
      description: defaultProduct?.description,
    },
  )

  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? commerceProps?.couponFromCode?.id : undefined)

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []

  return (
    <Layout>
      <header className="mx-auto flex min-h-[calc(85vh)] w-full items-center justify-center bg-gradient-to-b from-gray-100 to-background text-center">
        <Balancer>
          <h1 className="py-24 text-6xl font-bold">
            Welcome to <i className="pr-2 font-medium">your</i> Skill App
          </h1>
        </Balancer>
      </header>
      <main>
        <article className="prose mx-auto w-full max-w-2xl px-3 sm:prose-lg">
          <LandingCopy />
        </article>
        {ALLOW_PURCHASE ? (
          <section id="buy">
            {products
              ?.filter((product: any) => product.state !== 'unavailable')
              .map((product, i) => {
                return (
                  <PriceCheckProvider
                    key={product.slug}
                    purchasedProductIds={purchasedProductIds}
                  >
                    <div data-pricing-container="" key={product.name}>
                      <Pricing
                        bonuses={bonuses}
                        allowPurchase={ALLOW_PURCHASE}
                        userId={commerceProps?.userId}
                        product={product}
                        purchased={purchasedProductIds.includes(
                          product.productId,
                        )}
                        purchases={commerceProps?.purchases}
                        index={i}
                        couponId={couponId}
                      />
                    </div>
                  </PriceCheckProvider>
                )
              })}
          </section>
        ) : (
          <PrimaryNewsletterCta className="pt-20" />
        )}
      </main>
    </Layout>
  )
}

export default Home
