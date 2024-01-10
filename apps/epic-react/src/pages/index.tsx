import React from 'react'
import Layout from '@/components/app/layout'
import type {GetStaticProps, NextPage} from 'next'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import {useRouter} from 'next/router'
import {trpc} from '@/trpc/trpc.client'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {getAllProducts, getPricing, getProduct} from '@/lib/products'
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
import {cn} from '@skillrecordings/ui/utils/cn'
import {pricingClassNames} from '@/styles/commerce'

const defaultProductId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

export const getStaticProps: GetStaticProps = async () => {
  const defaultProduct = await getProduct(defaultProductId as string)
  const pricing = await getPricing()
  const products = pricing && pricing.products
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
  const instructorName = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  return (
    <Layout>
      <Container as="header" className="py-48">
        <h1 className="leading-0 w-full text-center text-4xl font-bold sm:text-5xl lg:text-6xl">
          <Balancer>{config.description}</Balancer>
        </h1>
        <div className="mt-10 flex items-center justify-center gap-2">
          <Image
            src={require('../../public/instructor.png')}
            alt={instructorName}
            width={48}
            height={48}
          />
          <span>{instructorName}</span>
        </div>
      </Container>
      <main>
        <Container className="pb-24">
          {landingCopy && (
            <article className="prose mx-auto w-full max-w-2xl px-6 dark:prose-invert sm:prose-lg sm:px-3">
              <MDX contents={landingCopy} />
            </article>
          )}
        </Container>
        <Container className="border-t py-10">
          {ALLOW_PURCHASE ? (
            <section id="buy" className="py-16">
              <h2 className="pb-10 text-center text-4xl font-bold">Buy Now</h2>
              <div className="items-starts flex justify-center gap-10">
                {products
                  ?.filter((product: any) => product.state !== 'unavailable')
                  .map((product, i) => {
                    return (
                      <PriceCheckProvider
                        key={product.slug}
                        purchasedProductIds={purchasedProductIds}
                      >
                        <div className={pricingClassNames()} key={product.name}>
                          <Pricing
                            options={{
                              withGuaranteeBadge: false,
                            }}
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
              </div>
            </section>
          ) : (
            <PrimaryNewsletterCta className="py-16" />
          )}
        </Container>
        <Container
          as="section"
          className="relative flex flex-col items-center justify-center gap-5 border-y py-16 sm:flex-row sm:gap-10"
        >
          <div className="relative">
            <Image
              src={require('../../public/instructor.png')}
              alt={config.author}
              width={200}
              height={200}
              quality={100}
            />
          </div>
          <div className="max-w-lg px-6 pb-32 sm:px-0 sm:pb-5">
            <h3 className="text-2xl font-semibold">Lorem ipsum dolor</h3>
            <p className="pt-5">
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
