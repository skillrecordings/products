import * as React from 'react'
import {GetServerSideProps} from 'next'
import Layout from 'components/app/layout'
import Image from 'next/image'
import {MailIcon} from '@heroicons/react/outline'
import {z} from 'zod'
import {
  stripeData,
  purchaseTypeSchema,
  convertToSerializeForNextResponse,
} from '@skillrecordings/commerce-server'
import {
  EXISTING_BULK_COUPON,
  NEW_BULK_COUPON,
  NEW_INDIVIDUAL_PURCHASE,
} from '@skillrecordings/types'
import {prisma} from '@skillrecordings/database'
import InviteTeam from 'components/team'
import {getSdk} from '@skillrecordings/database'
import Card from 'components/team/card'
import {UserGroupIcon} from '@heroicons/react/outline'

const thanksProps = z.object({
  email: z.string().email(),
  seatsPurchased: z.number(),
  purchaseType: purchaseTypeSchema,
  // TODO: these can be z.thing().nullable()
  bulkCouponId: z.string().or(z.null()),
  selfRedeemedPurchase: z.object({}).or(z.null()),
  bulkCouponPurchase: z.any(),
})
type ThanksProps = z.infer<typeof thanksProps>

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {query} = context

  const {session_id} = query

  if (!session_id) {
    return {
      notFound: true,
    }
  }

  const purchaseInfo = await stripeData(session_id as string)

  const {email, stripeChargeId, quantity: seatsPurchased} = purchaseInfo

  // Find the purchase associated with this stripeChargeId
  // - Is the tied to a bulk coupon?
  //   - If so, is it the first one?
  //     - Yes: NEW_BULK_COUPON
  //     - No:  EXISTING_BULK_COUPON
  //   - If not: NEW_INDIVIDUAL_PURCHASE

  const purchase = await prisma.purchase.findFirst({
    where: {
      merchantCharge: {
        identifier: stripeChargeId,
      },
    },
    include: {
      bulkCoupon: {
        include: {
          bulkCouponPurchases: true,
        },
      },
    },
  })

  if (!purchase || !email) {
    return {
      notFound: true,
    }
  }

  let purchaseType: z.infer<typeof purchaseTypeSchema>
  if (purchase.bulkCoupon) {
    if (purchase.bulkCoupon.bulkCouponPurchases.length > 1) {
      purchaseType = EXISTING_BULK_COUPON
    } else {
      purchaseType = NEW_BULK_COUPON
    }
  } else {
    purchaseType = NEW_INDIVIDUAL_PURCHASE
  }

  let bulkCouponRedemptionPurchase: object | null = null
  if (purchase.bulkCoupon?.id) {
    const {getUserByEmail, getBulkCouponRedemptionPurchase} = getSdk()
    const user = await getUserByEmail(email)
    bulkCouponRedemptionPurchase = await getBulkCouponRedemptionPurchase(
      purchase.bulkCoupon.id,
      user?.id || null,
    )
  }

  const validatedProps = thanksProps.parse({
    email,
    seatsPurchased,
    purchaseType,
    bulkCouponId: purchase.bulkCoupon?.id || null,
    selfRedeemedPurchase: bulkCouponRedemptionPurchase,
    bulkCouponPurchase: convertToSerializeForNextResponse(purchase),
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
  selfRedeemedPurchase,
  bulkCouponPurchase,
}) => {
  const isTeamPurchase =
    purchaseType === NEW_BULK_COUPON || purchaseType === EXISTING_BULK_COUPON
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
              <div className="text-gray-900 mt-4">
                <Card
                  title={{as: 'h1', content: 'Invite your team'}}
                  icon={
                    <UserGroupIcon
                      className="w-5 text-green-500"
                      aria-hidden="true"
                    />
                  }
                >
                  <InviteTeam
                    userEmail={email}
                    purchase={bulkCouponPurchase}
                    existingPurchaseForSelf={!!selfRedeemedPurchase}
                  />
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default ThanksVerify
