import Layout from 'components/app/layout'
import {Header} from 'components/home/home-header'
import {Copy} from 'components/home/home-body-copy'
import React from 'react'
import {useSkillLevel} from 'components/home/use-skill-level'
import {useCoupon} from 'path-to-purchase-react/use-coupon'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {Element} from 'react-scroll'
import {PricingTiers} from '../path-to-purchase-react/product-tiers'
import Image from 'next/legacy/image'
import {MDXComponents} from '../components/mdx'
import {isSellingLive} from 'utils/is-selling-live'
import {SubscribeToNewsletter} from 'components/home/home-newsletter-cta'

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
  const {redeemableCoupon, RedeemDialogForCoupon} = useCoupon(couponFromCode)
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
            className="flex flex-col items-center bg-[#081021] py-40"
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
            <h2 className="mx-auto max-w-[20ch] px-3 text-center font-heading text-4xl font-bold sm:text-5xl lg:text-5xl xl:text-6xl">
              Your Total TypeScript Adventure Starts Now
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
              <Element name="buy" aria-hidden="true" />
              <PricingTiers
                products={products}
                userId={userId}
                purchases={purchases}
                couponIdFromCoupon={couponIdFromCoupon}
                couponFromCode={couponFromCode}
              />
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
