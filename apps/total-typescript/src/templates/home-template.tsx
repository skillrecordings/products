import Layout from 'components/app/layout'
import {Header} from 'components/home/home-header'
import {Copy} from 'components/home/home-body-copy'
import {SubscribeToNewsletter} from 'components/home/home-newsletter-cta'
import React from 'react'
import {useSkillLevel} from 'components/home/use-skill-level'
import {useCoupon} from 'path-to-purchase-react/use-coupon'
import {
  CommerceProps,
  CouponForCode,
} from '@skillrecordings/commerce-server/dist/@types'
import {Element} from 'react-scroll'
import {PricingTiers} from '../path-to-purchase-react/product-tiers'
import Image from 'next/image'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '../utils/analytics'
import {MDXComponents} from '../components/mdx'

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
  console.log({products})
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
          <h2 className="mx-auto max-w-[15ch] text-center font-heading text-4xl font-bold sm:text-5xl lg:text-5xl xl:text-6xl">
            Become a TypeScript Wizard
          </h2>
          <div className="flex w-full flex-col items-center pt-16">
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
        {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
      </main>
    </Layout>
  )
}
