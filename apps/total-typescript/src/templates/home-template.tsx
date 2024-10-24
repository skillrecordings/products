import Layout from '@/components/app/layout'
import {Header} from '@/components/home/home-header'
import {Copy} from '@/components/home/home-body-copy'
import React from 'react'
import {useSkillLevel} from '@/components/home/use-skill-level'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {
  CommerceProps,
  type SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {Element} from 'react-scroll'
import Image from 'next/image'
import {isSellingLive} from '@/utils/is-selling-live'
import {SubscribeToNewsletter} from '@/components/home/home-newsletter-cta'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import cx from 'classnames'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {trpc} from '@/trpc/trpc.client'
import {cn} from '@skillrecordings/ui/utils/cn'
import {Companies} from '@/components/companies'
import Head from 'next/head'

export const HomeTemplate: React.FC<
  React.PropsWithChildren<CommerceProps & {level?: string}>
> = ({
  level,
  couponFromCode,
  purchases = [],
  userId,
  products,
  couponIdFromCoupon,
  allowPurchase,
}) => {
  const skillLevel = useSkillLevel(level)

  const restrictedToProduct = couponFromCode?.restrictedToProductId
    ? products.find(
        (product) => product.productId === couponFromCode.restrictedToProductId,
      )
    : undefined

  const productMetadata = restrictedToProduct
    ? {
        ...restrictedToProduct,
        id: restrictedToProduct.productId,
        image: {
          ...restrictedToProduct.image,
          width: 132,
          height: 112,
        },
      }
    : undefined

  const {validCoupon} = useCoupon(couponFromCode, productMetadata)
  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)
  const sortedProductsByName = products.sort((a, b) => {
    if (a.title === 'TypeScript Pro Essentials') {
      return -1
    }
    if (b.title === 'Complete Volume') {
      return 0
    }
    return 0
  })
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)
  const {data: defaultCouponData, status: defaultCouponStatus} =
    trpc.pricing.defaultCoupon.useQuery()

  return (
    <Layout
      className={cn('', {
        'lg:pt-16': defaultCouponData,
      })}
      withNavLinks={false}
      meta={{
        title: `Professional TypeScript Training by Matt Pocock `,
        ogImage: couponFromCode && {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1669888351/illustrations/golden-ticket_2x_hkd8x3.png',
          alt: 'Golden Ticket',
        },
      }}
    >
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`RSS feed for ${process.env.NEXT_PUBLIC_SITE_TITLE}`}
          href="/rss.xml"
        />
      </Head>
      <Header level={skillLevel} />
      <main className="overflow-x-hidden">
        <Copy
          components={{
            Companies,
            Buy: () => {
              return (
                <section
                  className="not-prose flex flex-col items-center pb-10 pt-16 sm:pt-24"
                  id="buy"
                >
                  <Image
                    width={300}
                    src={require('../../public/assets/feather@2x.png')}
                    alt=""
                    aria-hidden="true"
                    className="-mt-24 mb-16 max-w-[300px] rotate-[-33deg] sm:-mt-32 sm:mb-24 sm:max-w-full"
                  />
                  <h2 className="mx-auto max-w-screen-lg text-balance px-3 text-center font-heading text-3xl font-bold sm:text-5xl lg:text-6xl xl:text-6xl">
                    Your Total TypeScript adventure starts now
                  </h2>
                  <div className="flex w-full flex-col items-center px-5 pb-0 pt-12 sm:pb-24">
                    <div className="pt-32">
                      <div className="flex flex-col-reverse gap-40 lg:flex lg:flex-row lg:gap-0">
                        {sortedProductsByName?.map((product, i) => {
                          const isFirst = products.length > 1 && i === 0
                          const isLast =
                            products.length > 1 && i === products.length - 1
                          const isPro = !isFirst && isLast

                          return (
                            <PriceCheckProvider
                              key={product.productId}
                              purchasedProductIds={purchasedProductIds}
                            >
                              <div
                                key={product.name}
                                className={cx('transition hover:opacity-100', {
                                  'mx-auto max-w-sm origin-top-left opacity-80 lg:mt-28 lg:scale-[90%]':
                                    isFirst,
                                  'origin-top lg:scale-105': isPro,
                                })}
                              >
                                <Element name="buy" aria-hidden="true" />
                                <Pricing
                                  index={i}
                                  product={product}
                                  userId={userId}
                                  purchased={purchasedProductIds.includes(
                                    product.productId,
                                  )}
                                  couponId={couponId}
                                  options={{
                                    withGuaranteeBadge: true,
                                    withImage: true,
                                  }}
                                  allowPurchase={allowPurchase}
                                />
                              </div>
                            </PriceCheckProvider>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-center pt-16">
                    <Image
                      src="https://res.cloudinary.com/total-typescript/image/upload/v1689864739/money-back-guarantee-large_l3sikc.png"
                      alt="30-Day Money Back Guarantee"
                      width={700 / 1.7}
                      height={252 / 1.7}
                      priority
                    />
                  </div>
                </section>
              )
            },
          }}
          level={skillLevel}
        />
      </main>
    </Layout>
  )
}
