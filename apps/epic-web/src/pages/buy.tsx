import {propsForCommerce} from '@skillrecordings/commerce-server'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import Balancer from 'react-wrap-balancer'
import {getPricing} from '@skillrecordings/skill-lesson/lib/pricing'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {cn} from '@skillrecordings/ui/utils/cn'
import Layout from 'components/app/layout'
import {GetServerSideProps} from 'next'
import {motion, useReducedMotion} from 'framer-motion'
import {getToken} from 'next-auth/jwt'
import Image from 'next/image'
import React from 'react'
import {getAvailableBonuses} from 'lib/available-bonuses'
import {useRouter} from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query} = context

  const token = await getToken({req})

  const pricing = await getPricing('primary')
  const products = pricing && pricing.products

  const availableBonuses = await getAvailableBonuses()

  const {props} = await propsForCommerce({
    query,
    token,
    products,
  })

  return {
    props: {
      ...props,
      bonuses: availableBonuses,
    },
  }
}

const BuyPage: React.FC<
  React.PropsWithChildren<CommerceProps & {bonuses: any}>
> = ({
  couponFromCode,
  purchases = [],
  userId,
  products,
  couponIdFromCoupon,
  defaultCoupon,
  allowPurchase,
  bonuses,
}) => {
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    couponFromCode,
    {
      image: {
        url: 'https://res.cloudinary.com/epic-web/image/upload/v1695972887/coupon_2x.png',
        width: 132,
        height: 112,
      },
      title: products[0].title as string,
      description: products[0]?.description,
    },
  )
  const router = useRouter()
  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)

  const purchasedProductIds = purchases.map((purchase) => purchase.productId)

  return (
    <Layout
      meta={{
        title: 'Buy Epic Web',
        ogImage: couponFromCode
          ? {
              url: 'https://res.cloudinary.com/epic-web/image/upload/v1687852770/golden-ticket.png',
              alt: 'Golden Ticket',
            }
          : undefined,
      }}
    >
      {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
      <header className="flex w-full flex-col items-center justify-center px-5 py-16 text-center">
        <h1 className="max-w-lg text-2xl font-bold sm:text-3xl lg:text-4xl">
          <Balancer>Become a Professional Full Stack Web Developer</Balancer>
        </h1>
        <h2 className="max-w-lg pt-5 text-lg text-gray-600 dark:text-gray-400">
          <Balancer>
            The most comprehensive guide to professional web development by Kent
            C. Dodds.
          </Balancer>
        </h2>
      </header>
      <main
        id="buy"
        className="relative flex flex-col items-center justify-start"
      >
        <Sparkles />
        {products
          ?.filter((product: any) => product.state !== 'unavailable')
          .map((product, i) => {
            const ALLOW_PURCHASE =
              router.query.allowPurchase === 'true' ||
              product.state === 'active'
            return (
              <PriceCheckProvider
                key={product.slug}
                purchasedProductIds={purchasedProductIds}
              >
                <div data-pricing-container="" key={product.name}>
                  <Pricing
                    bonuses={bonuses}
                    allowPurchase={ALLOW_PURCHASE}
                    userId={userId}
                    product={product}
                    purchased={purchasedProductIds.includes(product.productId)}
                    index={i}
                    couponId={couponId}
                    couponFromCode={couponFromCode}
                  />
                </div>
              </PriceCheckProvider>
            )
          })}
      </main>
      <Image
        className="mx-auto -mt-16 mb-16"
        src="https://res.cloudinary.com/total-typescript/image/upload/v1669928567/money-back-guarantee-badge-16137430586cd8f5ec2a096bb1b1e4cf_o5teov.svg"
        width={130}
        height={130}
        alt="30-Day Money Back Guarantee"
      />
    </Layout>
  )
}

export default BuyPage

export const Sparkles = () => {
  const shouldReduceMotion = useReducedMotion()

  return shouldReduceMotion ? null : (
    <div className="absolute top-24 z-10" aria-hidden>
      <motion.div
        className={cn(
          'absolute left-1 mt-0 text-yellow-300 opacity-75 blur-[2px]',
        )}
        initial={{scale: 0}}
        animate={{
          scale: [0, 1, 0],
          rotateZ: [0, -360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 1,
          delay: 1,
          ease: 'easeInOut',
        }}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40 0L45.4306 34.5694L80 40L45.4306 45.4306L40 80L34.5694 45.4306L0 40L34.5694 34.5694L40 0Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
      <motion.div
        className={cn('absolute left-10 mt-16 text-yellow-300 blur-[1px]')}
        initial={{scale: 0}}
        animate={{
          scale: [0, 1, 0],
          rotateZ: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 0.5,
          delay: 0.5,
          ease: 'easeInOut',
        }}
      >
        <svg
          className="h-10 w-10"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40 0L45.4306 34.5694L80 40L45.4306 45.4306L40 80L34.5694 45.4306L0 40L34.5694 34.5694L40 0Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
      <motion.div
        className={cn('absolute right-[12px] mt-16 text-yellow-300 blur-[2px]')}
        initial={{scale: 0}}
        animate={{
          scale: [0, 0.75, 0],
          rotateZ: [0, -540],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatDelay: 1,
          delay: 0.5,
          ease: 'easeInOut',
        }}
      >
        <svg
          className="h-10 w-10"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40 0L45.4306 34.5694L80 40L45.4306 45.4306L40 80L34.5694 45.4306L0 40L34.5694 34.5694L40 0Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
      <motion.div
        className={cn('absolute left-[12px] mt-20 text-yellow-300 blur-[2px]')}
        initial={{scale: 0}}
        animate={{
          scale: [0, 2, 0],
          rotateZ: [0, 360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatDelay: 1,
          delay: 1,
          ease: 'easeInOut',
        }}
      >
        <svg
          className="h-10 w-10"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40 0L45.4306 34.5694L80 40L45.4306 45.4306L40 80L34.5694 45.4306L0 40L34.5694 34.5694L40 0Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </div>
  )
}
