import React from 'react'
import Layout from '@/components/app/layout'
import type {GetStaticProps, NextPage} from 'next'
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
import Container from '@/components/app/container'
import Image from 'next/image'
import Link from 'next/link'
import {getPage} from '@/lib/pages'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {cn} from '@skillrecordings/ui/utils/cn'

const defaultProductId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

export const getStaticProps: GetStaticProps = async () => {
  // const defaultProduct = await getProduct(defaultProductId as string)
  // const products = await getAllProducts()
  // const availableBonuses = await getAvailableBonuses()
  const page = await getPage('/')
  const landingCopy = page.body && (await serializeMDX(page.body))

  return {
    props: {
      landingCopy,
      defaultProduct: null,
      products: [],
    },
    revalidate: 10,
  }
}

const Home: NextPage<{
  landingCopy?: MDXRemoteSerializeResult
  defaultProduct?: SanityProduct
  products: SanityProduct[]
  bonuses: any[]
}> = ({landingCopy, defaultProduct, products, bonuses}) => {
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
      <Container
        as="header"
        className="pointer-events-none relative flex min-h-[calc(100svh-80px-80px)] flex-col items-center justify-center space-y-10 px-0 text-center lg:px-0"
      >
        <h1 className="whitespace-nowrap text-center text-4xl sm:text-5xl lg:text-6xl">
          Empower Developers
          <br /> and Grow Your Brand
        </h1>

        <h2 className="font-mono text-sm uppercase opacity-75">
          Professional DevRel™ Training
        </h2>
      </Container>
      <div className="flex h-20 w-full justify-center gap-2 border-t font-mono text-sm">
        <Container className="flex h-full items-center justify-between">
          <div className="flex h-full items-center gap-5">
            <Link
              href="https://x.com/t3dotgg"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-center gap-2"
            >
              <Image
                className="inline-flex rounded-[2px]"
                src={require('../../public/theo.jpg')}
                alt="Theo"
                width={48}
                height={48}
              />
              <div className="flex flex-col opacity-75 transition group-hover:opacity-100">
                <span className="font-sans text-base font-medium leading-tight">
                  Theo - t3.gg
                </span>
                <span className="flex items-center gap-1 font-sans text-sm font-light opacity-75">
                  <span>Author & Instructor</span>
                  {/* <svg
                    viewBox="0 0 24 24"
                    className="inline-block h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  >
                    <g>
                      <path
                        fill="currentColor"
                        d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"
                      ></path>
                    </g>
                  </svg>
                  <span>San Francisco, CA</span> */}
                </span>
              </div>
            </Link>
          </div>
          <div className="flex h-full items-center gap-5">
            <div className="flex h-full items-center gap-1 opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <g
                  strokeWidth="1"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse
                    cx="8"
                    cy="8"
                    rx="3.214"
                    ry="7.5"
                    stroke="currentColor"
                  />
                  <line
                    x1="0.5"
                    y1="8"
                    x2="15.5"
                    y2="8"
                    stroke="currentColor"
                  />
                  <circle cx="8" cy="8" r="7.5" />
                </g>
              </svg>
              {/* <span className="text-base">©</span> {new Date().getFullYear()}{' '} */}
            </div>
          </div>
        </Container>
      </div>

      <main
        className={cn('', {
          'border-t': landingCopy,
        })}
      >
        {landingCopy && (
          <Container>
            <article className="prose mx-auto w-full max-w-2xl px-3 py-24 sm:prose-lg lg:prose-xl">
              <MDX contents={landingCopy} />
            </article>
          </Container>
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
          <div className="border-t" id="join">
            <Container className="flex items-center justify-center px-0 sm:px-0 lg:px-0">
              <PrimaryNewsletterCta className="w-full" />
            </Container>
          </div>
        )}
      </main>
    </Layout>
  )
}

export default Home
