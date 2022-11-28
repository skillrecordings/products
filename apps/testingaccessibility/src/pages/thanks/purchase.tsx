import * as React from 'react'
import {GetServerSideProps} from 'next'
import Layout from 'components/app/layout'
import Image from 'next/image'
import {MailIcon} from '@heroicons/react/outline'
import {z} from 'zod'
import {
  stripeData,
  purchaseTypeSchema,
  determinePurchaseType,
} from '@skillrecordings/commerce-server'
import {
  EXISTING_BULK_COUPON,
  NEW_BULK_COUPON,
  NEW_INDIVIDUAL_PURCHASE,
  INDIVIDUAL_TO_BULK_UPGRADE,
} from '@skillrecordings/types'
import {getSdk} from '@skillrecordings/database'
import Link from 'next/link'
import CopyInviteLink from 'components/team/copy-invite-link'

const thanksProps = z.object({
  email: z.string().email(),
  seatsPurchased: z.number(),
  purchaseType: purchaseTypeSchema,
  bulkCouponId: z.string().or(z.null()),
})
type ThanksProps = z.infer<typeof thanksProps>

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {query} = context

  const {session_id: checkoutSessionId} = query

  if (!checkoutSessionId) {
    return {
      notFound: true,
    }
  }

  const purchaseInfo = await stripeData({
    checkoutSessionId: checkoutSessionId as string,
  })

  const {email, stripeChargeId, quantity: seatsPurchased} = purchaseInfo

  const purchase = await getSdk().getPurchaseForStripeCharge(stripeChargeId)

  if (!purchase || !email) {
    return {
      notFound: true,
    }
  }

  const purchaseType = await determinePurchaseType({
    checkoutSessionId: checkoutSessionId as string,
  })

  const validatedProps = thanksProps.parse({
    email,
    seatsPurchased,
    purchaseType,
    bulkCouponId: purchase.bulkCoupon?.id || null,
  })

  return {
    props: validatedProps,
  }
}

const determineImageSrc = (isNewPurchase: boolean) => {
  const travelJournalImage = require('../../../public/assets/travel-journal@2x.png')
  const newMailImage = require('../../../public/assets/new-mail@2x.png')

  return isNewPurchase ? newMailImage : travelJournalImage
}

const ThanksVerify: React.FC<React.PropsWithChildren<ThanksProps>> = ({
  email,
  seatsPurchased,
  purchaseType,
  bulkCouponId,
}) => {
  const isTeamPurchase =
    purchaseType === NEW_BULK_COUPON ||
    purchaseType === EXISTING_BULK_COUPON ||
    purchaseType === INDIVIDUAL_TO_BULK_UPGRADE
  const isNewPurchase =
    purchaseType === NEW_BULK_COUPON || purchaseType === NEW_INDIVIDUAL_PURCHASE

  const imageSrc = determineImageSrc(isNewPurchase)

  return (
    <Layout
      footer={null}
      className="bg-green-700 bg-noise"
      meta={{title: 'Purchase Successful'}}
    >
      <main className="flex flex-col flex-grow items-center justify-center pt-5 pb-16 px-5 text-white">
        <div className="flex flex-col max-w-screen-md mx-auto w-full gap-5 items-center text-center">
          <Image
            priority
            width={460 / 2}
            height={368 / 2}
            quality={100}
            placeholder="blur"
            src={imageSrc}
            aria-hidden="true"
            alt=""
          />
          <div>
            <h1 className="text-orange-200 font-heading text-xl font-medium">
              Thank you for purchasing{' '}
              {purchaseType === EXISTING_BULK_COUPON && 'more seats for'}{' '}
              Testing Accessibility!
            </h1>
            {isTeamPurchase && (
              <p className="text-sand-100 max-w-md font-medium leading-relaxed mx-auto">
                Your purchase is for <strong>{seatsPurchased}</strong>{' '}
                {purchaseType === EXISTING_BULK_COUPON && 'additional'} seats.
                {purchaseType === NEW_BULK_COUPON &&
                  'You can always add more seats later when your team grows.'}
              </p>
            )}
            {isNewPurchase && (
              <>
                <h2 className="max-w-lg mx-auto font-bold lg:text-4xl text-3xl py-5">
                  Please check your inbox for a login link that just got sent.
                  <code className="px-6 py-3 rounded-md bg-white inline-flex items-center gap-2 font-sans text-black my-10 font-semibold sm:text-xl text-lg">
                    <MailIcon
                      className="w-5 h-5 text-green-500"
                      aria-hidden="true"
                    />{' '}
                    {email}
                  </code>
                </h2>
                <p className="text-sand-100 max-w-md font-medium leading-relaxed mx-auto">
                  As a final step to access the course you need to check your
                  inbox (<strong>{email}</strong>) where you will find an email
                  from <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong>{' '}
                  with a link to access your purchase and start learning.
                </p>
              </>
            )}
            {!isNewPurchase && !!bulkCouponId && (
              <>
                <h2 className="max-w-lg mx-auto font-bold lg:text-4xl text-3xl py-5">
                  Invite Your Team
                </h2>
                <div className="w-full text-gray-900">
                  <CopyInviteLink bulkCouponId={bulkCouponId} />
                </div>
                <p className="text-sand-100 max-w-md font-medium leading-relaxed mx-auto mt-2">
                  You can also visit your{' '}
                  <Link href="/team">
                    <a className="py-1 inline-flex text-base font-medium hover:underline transition">
                      Team Invite
                    </a>
                  </Link>{' '}
                  page anytime to get the share link for distributing to your
                  team.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default ThanksVerify
