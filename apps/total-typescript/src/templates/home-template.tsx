import Layout from 'components/app/layout'
import {Header} from 'components/home/home-header'
import {Copy} from 'components/home/home-body-copy'
import {SubscribeToNewsletter} from 'components/home/home-newsletter-cta'
import React from 'react'
import {useSkillLevel} from 'components/home/use-skill-level'
import {useCoupon} from 'path-to-purchase-react/use-coupon'
import {CouponForCode} from '@skillrecordings/commerce-server/dist/@types'

export const HomeTemplate: React.FC<
  React.PropsWithChildren<{couponFromCode?: CouponForCode; level?: string}>
> = ({level, couponFromCode}) => {
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
    >
      <Header level={skillLevel} />
      <main>
        <Copy level={skillLevel} />
        <SubscribeToNewsletter level={skillLevel} />
        {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
      </main>
    </Layout>
  )
}
