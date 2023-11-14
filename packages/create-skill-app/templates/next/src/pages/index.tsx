import React from 'react'
import Layout from '@/components/app/layout'
import type {GetStaticProps, NextPage} from 'next'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
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
import Image from 'next/image'
import {getPage} from '@/lib/pages'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import config from '../config'
import Container from '@/components/app/container'
import Balancer from 'react-wrap-balancer'

const defaultProductId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

export const getStaticProps: GetStaticProps = async () => {
  const defaultProduct = await getProduct(defaultProductId as string)
  const products = await getAllProducts()
  const availableBonuses = await getAvailableBonuses()
  const landingPage = await getPage('landing-page')
  const landingCopy = landingPage?.body
    ? await serializeMDX(landingPage?.body)
    : null

  return {
    props: {
      defaultProduct,
      landingCopy,
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
  landingCopy?: MDXRemoteSerializeResult
}> = ({defaultProduct, products, bonuses, landingCopy}) => {
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
      <Container as="header" className="py-48">
        <h1 className="leading-0 w-full text-center text-4xl font-bold sm:text-5xl lg:text-6xl">
          <Balancer>{config.description}</Balancer>
        </h1>
        <div className="bottom-[20%] right-[15%] mt-8 flex items-center gap-2 lg:absolute lg:mt-0">
          <Image
            src={require('../../public/instructor.png')}
            alt={config.author}
            priority
            className="w-12 rounded-sm lg:w-auto"
            width={64}
            height={64}
          />
          <div className="flex flex-col">
            <span className="text-base">{config.author}</span>
            <span className="text-sm opacity-60">Author & Instructor</span>
          </div>
        </div>
        {/* <Image
          priority
          className="-z-10 object-cover sm:object-contain"
          src={require('../../public/assets/hero@2x.jpg')}
          fill
          alt=""
          aria-hidden="true"
        /> */}
      </Container>
      <main>
        <Container>
          {landingCopy && (
            <article className="prose mx-auto w-full max-w-2xl px-6 dark:prose-invert sm:prose-lg sm:px-3">
              <MDX contents={landingCopy} />
            </article>
          )}
        </Container>
        <Container>
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
            <PrimaryNewsletterCta />
          )}
        </Container>

        <Container
          as="section"
          className="relative flex flex-col items-center gap-10 border-t pt-16 sm:flex-row sm:gap-20 sm:pt-32"
        >
          <div className="relative">
            <Image
              src={require('../../public/instructor.png')}
              alt={config.author}
              width={478}
              height={582}
              quality={100}
            />
          </div>
          <div className="max-w-lg px-6 pb-32 sm:px-0 sm:pb-5">
            <h3 className="font- text-3xl sm:text-4xl lg:text-5xl">
              Lorem Adam Dolor Sit
            </h3>
            <p className="pt-5 text-lg leading-relaxed sm:pt-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              ultrices porta metus, a imperdiet lorem aliquam finibus. Etiam
              dapibus fermentum ligula, vel tincidunt dui tempus nec. Morbi a
              hendrerit odio. Curabitur pellentesque tellus a condimentum.
            </p>
          </div>
        </Container>
      </main>
      <div aria-hidden="true" className="py-10" />
    </Layout>
  )
}

export default Home
