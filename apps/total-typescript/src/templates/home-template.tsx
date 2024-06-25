import Layout from '@/components/app/layout'
import {Header} from '@/components/home/home-header'
import {Copy} from '@/components/home/home-body-copy'
import React from 'react'
import {useSkillLevel} from '@/components/home/use-skill-level'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {Element} from 'react-scroll'
import Image from 'next/image'
import {MDXComponents} from '../components/mdx'
import {isSellingLive} from '@/utils/is-selling-live'
import {SubscribeToNewsletter} from '@/components/home/home-newsletter-cta'
import Balancer from 'react-wrap-balancer'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import cx from 'classnames'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {trpc} from '@/trpc/trpc.client'
import {cn} from '@skillrecordings/ui/utils/cn'

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

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    couponFromCode,
    productMetadata,
  )
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
      meta={{
        title: `Professional TypeScript Training by Matt Pocock `,
        ogImage: couponFromCode && {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1669888351/illustrations/golden-ticket_2x_hkd8x3.png',
          alt: 'Golden Ticket',
        },
      }}
    >
      <Header level={skillLevel} />
      <main>
        <Copy level={skillLevel} />
        {isSellingLive ? (
          <div
            className="flex flex-col items-center pb-16 pt-24 sm:pt-32"
            // slot={null}
          >
            <Image
              width={300}
              src={require('../../public/assets/feather@2x.png')}
              alt=""
              aria-hidden="true"
              className="mb-16 max-w-[300px] -rotate-12 sm:max-w-full"
            />
            <h2 className="mx-auto max-w-screen-lg text-balance px-3 text-center font-heading text-3xl font-bold sm:text-5xl lg:text-6xl xl:text-6xl">
              Your Total TypeScript Adventure Starts Now
            </h2>
            <div
              className="flex w-full flex-col items-center px-5 pb-0 pt-12 sm:pb-24"
              id="buy"
            >
              <Image
                src={require('../../public/assets/landing/bg-divider-5.png')}
                alt=""
                aria-hidden="true"
                fill
                className="pointer-events-none z-0 translate-y-80 select-none object-contain object-top"
                quality={100}
              />
              <section className="pt-32">
                <div className="flex flex-col-reverse gap-40 lg:flex lg:flex-row lg:gap-0">
                  {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
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
              </section>
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
          </div>
        ) : (
          <SubscribeToNewsletter level={skillLevel} />
        )}
        {/* <div className="pointer-events-none select-none">
          <Image
            aria-hidden="true"
            alt=""
            src={require('../../public/assets/landing/bg-divider-4.png')}
            fill
            className="rotate-180 select-none object-contain object-top"
            quality={100}
          />
        </div> */}

        {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
      </main>
    </Layout>
  )
}
