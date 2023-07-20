import Layout from '@/components/app/layout'
import {Header} from '@/components/home/home-header'
import {Copy} from '@/components/home/home-body-copy'
import React from 'react'
import {useSkillLevel} from '@/components/home/use-skill-level'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {Element} from 'react-scroll'
import {PricingTiers} from '@skillrecordings/skill-lesson/path-to-purchase/product-tiers'
import Image from 'next/legacy/image'
import {MDXComponents} from '../components/mdx'
import {isSellingLive} from '@/utils/is-selling-live'
import {SubscribeToNewsletter} from '@/components/home/home-newsletter-cta'
import Balancer from 'react-wrap-balancer'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import cx from 'classnames'

export const HomeTemplate: React.FC<
  React.PropsWithChildren<CommerceProps & {level?: string}>
> = ({
  level,
  couponFromCode,
  purchases = [],
  userId,
  products,
  couponIdFromCoupon,
  defaultCoupon,
}) => {
  const skillLevel = useSkillLevel(level)
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} =
    useCoupon(couponFromCode)
  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)
  const sortedProductsByName = products.sort((a, b) => {
    if (a.title === 'Core Volume') {
      return -1
    }
    if (b.title === 'Core Volume + React Bundle') {
      return 0
    }
    if (b.title === 'Advanced React with TypeScript') {
      return 1
    }
    return 0
  })
  return (
    <Layout
      meta={{
        title: `Professional TypeScript Training by Matt Pocock `,
        ogImage: couponFromCode && {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1669888351/illustrations/golden-ticket_2x_hkd8x3.png',
          alt: 'Golden Ticket',
        },
      }}
      defaultCoupon={defaultCoupon}
    >
      <Header level={skillLevel} />
      <main>
        <Copy level={skillLevel} />
        {isSellingLive ? (
          <MDXComponents.Section
            className="-mb-40 flex flex-col items-center bg-[#081021] py-24 pb-56 sm:py-40 sm:pb-56"
            slot={
              <Image
                src="/assets/landing/bg-divider-7.png"
                layout="fill"
                className="pointer-events-none select-none object-contain"
                objectPosition="top center"
                quality={100}
              />
            }
          >
            <h2 className="mx-auto max-w-screen-lg px-3 text-center font-heading text-3xl font-bold sm:text-5xl lg:text-5xl xl:text-6xl">
              <Balancer>Your Total TypeScript Adventure Starts Now</Balancer>
            </h2>
            <div className="flex w-full flex-col items-center pt-5" id="buy">
              <Image
                src={require('../../public/assets/landing/bg-divider-5.png')}
                alt=""
                aria-hidden="true"
                layout="fill"
                className="pointer-events-none z-0 translate-y-80 select-none object-contain object-top"
                quality={100}
              />
              <section className="px-5 pb-20 pt-40">
                <div className="grid gap-40 lg:flex lg:gap-8 xl:gap-16">
                  {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
                  {sortedProductsByName?.map((product, i) => {
                    const isFirst = products.length > 1 && i === 0
                    const isLast =
                      products.length > 1 && i === products.length - 1
                    const isPro = !isFirst && !isLast

                    return (
                      <div
                        key={product.name}
                        className={cx('transition hover:opacity-100', {
                          'mx-auto max-w-sm origin-top-right opacity-90 lg:mt-16 lg:scale-95':
                            isFirst,
                          'mx-auto max-w-sm origin-top-left opacity-80 lg:mt-28 lg:scale-[80%]':
                            isLast,
                          // switch up order when stacked vertically
                          'row-start-1 origin-top xl:scale-105': isPro,
                          'row-start-3': isLast,
                        })}
                      >
                        <Element name="buy" aria-hidden="true" />
                        <Pricing
                          product={product}
                          userId={userId}
                          purchases={purchases}
                          couponId={couponId}
                        />
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>
          </MDXComponents.Section>
        ) : (
          <SubscribeToNewsletter level={skillLevel} />
        )}
        <div className="pointer-events-none select-none">
          <Image
            layout="fill"
            aria-hidden="true"
            alt=""
            src={require('../../public/assets/landing/bg-divider-4.png')}
            objectPosition={'top'}
            className="rotate-180 select-none object-contain"
            quality={100}
          />
        </div>
        {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
      </main>
    </Layout>
  )
}
