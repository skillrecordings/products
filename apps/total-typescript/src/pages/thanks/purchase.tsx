import * as React from 'react'
import {GetServerSideProps} from 'next'
import Layout from 'components/app/layout'
import {MailIcon} from '@heroicons/react/outline'
import {
  determinePurchaseType,
  PurchaseType,
  stripeData,
} from '@skillrecordings/commerce-server'
import {
  EXISTING_BULK_COUPON,
  INDIVIDUAL_TO_BULK_UPGRADE,
  NEW_BULK_COUPON,
  NEW_INDIVIDUAL_PURCHASE,
} from '@skillrecordings/types'
import {getSdk} from '@skillrecordings/database'
import CopyInviteLink from 'team/copy-invite-link'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {query} = context

  const {session_id} = query

  if (!session_id) {
    return {
      notFound: true,
    }
  }

  const purchaseInfo = await stripeData({
    checkoutSessionId: session_id as string,
  })

  const {email, stripeChargeId, quantity: seatsPurchased} = purchaseInfo

  const purchase = await getSdk().getPurchaseForStripeCharge(stripeChargeId)

  if (!purchase || !email) {
    return {
      notFound: true,
    }
  }

  const purchaseType = await determinePurchaseType({
    checkoutSessionId: session_id as string,
  })

  return {
    props: {
      email,
      seatsPurchased,
      purchaseType,
      bulkCouponId: purchase.bulkCoupon?.id || null,
    },
  }
}

const ThanksVerify: React.FC<
  React.PropsWithChildren<{
    email: string
    seatsPurchased: number
    purchaseType: PurchaseType
    bulkCouponId: string
  }>
> = ({email, seatsPurchased, purchaseType, bulkCouponId}) => {
  const isTeamPurchase =
    purchaseType === NEW_BULK_COUPON ||
    purchaseType === EXISTING_BULK_COUPON ||
    purchaseType === INDIVIDUAL_TO_BULK_UPGRADE
  const isNewPurchase =
    purchaseType === NEW_BULK_COUPON || purchaseType === NEW_INDIVIDUAL_PURCHASE

  return (
    <Layout footer={null} meta={{title: 'Purchase Successful'}}>
      <main className="font-brandon flex min-h-screen flex-grow flex-col items-center justify-center py-28 px-5 text-white">
        <div className="mx-auto flex w-full max-w-screen-md flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-medium text-cyan-200 sm:text-xl">
              Thank you for purchasing{' '}
              {purchaseType === EXISTING_BULK_COUPON && 'more seats for'}{' '}
              {process.env.NEXT_PUBLIC_SITE_TITLE}!
            </h1>
            {isTeamPurchase && (
              <p className="text-sand-100 mx-auto max-w-md font-medium leading-relaxed">
                Your purchase is for <strong>{seatsPurchased}</strong>{' '}
                {purchaseType === EXISTING_BULK_COUPON && 'additional'} seats.
                {purchaseType === NEW_BULK_COUPON && (
                  <>
                    {' '}
                    You can always add more seats later when your team grows.
                  </>
                )}
              </p>
            )}
            {isNewPurchase && (
              <>
                <h2 className="mx-auto max-w-lg py-5 text-3xl font-bold lg:text-4xl">
                  Please check your inbox for a login link that just got sent.
                </h2>
                <code className="font-brandon my-10 flex items-center justify-center gap-2 rounded-md bg-gray-800 px-6 py-3 text-lg font-medium text-white sm:text-xl">
                  <MailIcon
                    className="h-5 w-5 text-cyan-300"
                    aria-hidden="true"
                  />{' '}
                  <span className="text-cyan-300">sent to:</span> {email}
                </code>
                <p className="mx-auto max-w-sm leading-relaxed text-gray-200 sm:text-lg">
                  As a final step to access the course you need to check your
                  inbox (<strong>{email}</strong>) where you will find an email
                  from <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong>{' '}
                  with a link to access your purchase and start learning.
                </p>
              </>
            )}
            {!isNewPurchase && !!bulkCouponId && (
              <>
                <h2 className="mx-auto max-w-lg py-5 text-3xl font-bold lg:text-4xl">
                  Invite Your Team
                </h2>
                <div className="w-full text-gray-900">
                  <CopyInviteLink bulkCouponId={bulkCouponId} />
                </div>
                <p className="mx-auto mt-2 max-w-sm leading-relaxed text-gray-200 sm:text-lg">
                  You can also visit your{' '}
                  <Link href="/team/invite">
                    <a className="inline-flex py-1 text-base font-medium transition hover:underline">
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
