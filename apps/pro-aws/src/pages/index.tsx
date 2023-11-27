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
import Balancer from 'react-wrap-balancer'

const defaultProductId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

export const getStaticProps: GetStaticProps = async () => {
  const defaultProduct = await getProduct(defaultProductId as string)
  const products = await getAllProducts()
  const availableBonuses = await getAvailableBonuses()
  const landingPage = await getPage('landing-page')
  const landingCopy =
    landingPage?.body && (await serializeMDX(landingPage?.body))

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
    <Layout meta={{title: 'Navigate the AWS Maze with Confidence'}}>
      <header className="relative mx-auto flex aspect-square w-full max-w-screen-xl flex-col items-center justify-center border-x border-b py-24 sm:aspect-[1280/800]">
        <h1 className="leading-0 w-full text-center text-5xl font-bold text-white sm:text-7xl lg:text-8xl">
          <Balancer>Navigate the AWS Maze with Confidence</Balancer>
        </h1>
        <h2 className="pt-2 text-base font-medium tracking-widest text-primary sm:pt-5 sm:text-xl lg:text-2xl">
          Professional AWS Training
        </h2>
        <div className="bottom-[20%] right-[15%] mt-8 flex items-center gap-2 lg:absolute lg:mt-0">
          <Image
            src={require('../../public/instructor.png')}
            alt="Adam Elmore"
            priority
            className="w-12 rounded-sm lg:w-auto"
            width={64}
            height={64}
          />
          <div className="flex flex-col">
            <span className="text-base">Adam Elmore</span>
            <span className="text-sm opacity-60">Author & Instructor</span>
          </div>
        </div>
        <Image
          priority
          className="-z-10 object-cover sm:object-contain"
          src={require('../../public/assets/hero@2x.jpg')}
          fill
          alt=""
          aria-hidden="true"
        />
      </header>
      <main className="mx-auto w-full max-w-screen-xl border-x border-b pt-5 sm:pt-24">
        {landingCopy && (
          <article className="prose mx-auto w-full max-w-[45rem] px-6 sm:prose-lg sm:px-3">
            <MDX contents={landingCopy} />
          </article>
        )}

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
                        index={i}
                        couponId={couponId}
                      />
                    </div>
                  </PriceCheckProvider>
                )
              })}
          </section>
        ) : (
          <PrimaryNewsletterCta className="px-6 pt-8 sm:px-0 sm:pt-20" />
        )}
        <section className="relative mt-16 flex flex-col items-center gap-10  border-t sm:mt-32 sm:flex-row sm:gap-20">
          <div className="relative">
            <Image
              src={require('../../public/assets/adam-elmore@2x.png')}
              alt="Adam Elmore"
              width={478}
              height={582}
              quality={100}
            />
            <div
              aria-hidden="true"
              className="absolute right-3 top-3 flex h-20 w-20 flex-col items-start justify-between border bg-background px-2 pb-2 sm:right-[-2rem] sm:top-[-2rem]"
            >
              <span className="text-border">—</span>
              <span className="text-3xl font-medium">Hi!</span>
            </div>
          </div>
          <div className="max-w-lg px-6 pb-32 sm:px-0 sm:pb-5">
            <h3 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              I'm Adam.
            </h3>
            <p className="pt-5 text-lg leading-relaxed sm:pt-8">
              I'm an AWS Hero and startup founder that's built web applications
              used by millions of people across the world every day. I've spent
              the last decade building on AWS, and when I started I was as lost
              as you are today. I created Pro AWS to give everyone a path
              through the maze to unleash our collective creativity.
            </p>
          </div>
          <Image
            className="absolute bottom-[-66px] left-[calc(50%-66px)]"
            src={require('../../public/assets/proawsdev-badge@2x.png')}
            alt="Pro AWS Dev"
            width={133}
            height={133}
            quality={100}
          />
        </section>
      </main>
      <div aria-hidden="true" className="py-10" />
    </Layout>
  )
}

export default Home
