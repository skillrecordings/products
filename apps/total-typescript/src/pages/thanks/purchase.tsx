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
import {getProduct} from 'path-to-purchase-react/products.server'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {useReward} from 'react-rewards'
import {useReducedMotion} from 'framer-motion'
import Image from 'next/legacy/image'

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

  const product = await getProduct(purchase.productId)

  return {
    props: {
      email,
      seatsPurchased,
      purchaseType,
      bulkCouponId: purchase.bulkCoupon?.id || null,
      product,
    },
  }
}

const PurchaseLayout: React.FC<
  React.PropsWithChildren<{
    productImage: {url: string; alt: string} | undefined
  }>
> = ({productImage, children}) => {
  const {reward} = useReward('reward', 'confetti', {
    startVelocity: 7,
    spread: 300,
    elementCount: 500,
    colors: [
      'rgba(144, 251, 255, 0.8)',
      'rgba(193, 240, 255, 0.8)',
      'rgba(94, 216, 255, 0.7)',
      'rgba(255,255,255, 0.85)',
      '#22314E',
      '#050B17',
    ],
    decay: 1,
    elementSize: 5,
  })
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    !shouldReduceMotion && reward()
  }, [shouldReduceMotion])

  return (
    <Layout footer={null} meta={{title: 'Purchase Successful'}}>
      <div
        aria-hidden="true"
        id="reward"
        className="absolute top-1/3 left-1/2 z-0"
      />
      <main className="relative z-10 flex min-h-screen flex-grow flex-col items-center justify-center px-5 pt-10 pb-28 text-white">
        <div className="mx-auto flex w-full max-w-screen-md flex-col items-center gap-5 text-center">
          {productImage && (
            <div className="translate-y-16">
              <Image
                priority
                src={productImage.url}
                width={812 / 2.4}
                height={925 / 2.4}
                alt={productImage.alt}
                aria-hidden="true"
              />
            </div>
          )}
          <div className="relative z-10 flex flex-col items-center">
            {children}
          </div>
        </div>
      </main>
    </Layout>
  )
}

const InlineTeamInvite = ({bulkCouponId}: {bulkCouponId?: string}) => {
  if (!bulkCouponId) return null

  return (
    <>
      <p className="mx-auto max-w-xl pt-5 text-sm text-gray-200 sm:text-base sm:leading-relaxed">
        Invite your team to claim seats right away with this invite link. Don't
        worry about saving this anywhere, it will always be available on your
        Team page once you sign in.
      </p>
      <div className="w-full text-gray-900">
        <CopyInviteLink bulkCouponId={bulkCouponId} />
      </div>
    </>
  )
}

const NewIndividualPostPurchasePage: React.FC<
  React.PropsWithChildren<{
    email: string
    product: SanityProduct
  }>
> = ({product, email}) => {
  return (
    <>
      <h1 className="max-w-md text-lg font-medium text-cyan-100 sm:text-lg">
        Thank you for purchasing{' '}
        {product?.name || process.env.NEXT_PUBLIC_SITE_TITLE}!
      </h1>
      <h2 className="mx-auto max-w-lg py-5 font-text text-3xl font-bold lg:text-4xl">
        Please check your inbox for a login link that just got sent.
      </h2>
      <code className="mb-10 mt-5 flex items-center justify-center gap-2 rounded-lg bg-cyan-500/10 px-4 py-3 font-sans text-base font-medium text-white shadow-xl sm:text-lg">
        <MailIcon className="h-5 w-5 text-cyan-200" aria-hidden="true" />{' '}
        <span className="text-cyan-200">Email sent to:</span> {email}
      </code>
      <p className="mx-auto max-w-xl pt-5 text-sm text-gray-200 sm:text-base sm:leading-relaxed">
        As a final step to access the course you need to check your inbox (
        <strong>{email}</strong>) where you will find an email from{' '}
        <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> with a link to
        access your purchase and start learning.
      </p>
    </>
  )
}

const NewBulkCouponPostPurchasePage: React.FC<
  React.PropsWithChildren<{
    email: string
    product: SanityProduct
    seatsPurchased: number
    bulkCouponId: string
  }>
> = ({product, email, seatsPurchased, bulkCouponId}) => {
  return (
    <>
      <h1 className="max-w-md text-lg font-medium text-cyan-100 sm:text-lg">
        Thank you for purchasing{' '}
        {product?.name || process.env.NEXT_PUBLIC_SITE_TITLE}!{' '}
        <br className="hidden sm:block" />
        Your purchase is for <strong>{seatsPurchased}</strong> seat
        {seatsPurchased > 1 && 's'}. You can always add more seats later when
        your team grows.
      </h1>
      <h2 className="mx-auto max-w-lg py-5 font-text text-3xl font-bold lg:text-4xl">
        Please check your inbox for a login link that just got sent.
      </h2>
      <code className="mb-10 mt-5 flex items-center justify-center gap-2 rounded-lg bg-cyan-500/10 px-4 py-3 font-sans text-base font-medium text-white shadow-xl sm:text-lg">
        <MailIcon className="h-5 w-5 text-cyan-200" aria-hidden="true" />{' '}
        <span className="text-cyan-200">Email sent to:</span> {email}
      </code>
      <p className="mx-auto max-w-xl pt-5 text-sm text-gray-200 sm:text-base sm:leading-relaxed">
        As a final step to access the course you need to check your inbox (
        <strong>{email}</strong>) where you will find an email from{' '}
        <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> with a link to
        access your purchase and start learning.
      </p>
      <InlineTeamInvite bulkCouponId={bulkCouponId} />
    </>
  )
}

const ExistingBulkCouponPostPurchasePage: React.FC<
  React.PropsWithChildren<{
    product: SanityProduct
    seatsPurchased: number
    bulkCouponId: string
  }>
> = ({product, seatsPurchased, bulkCouponId}) => {
  return (
    <>
      <h1 className="max-w-md text-lg font-medium text-cyan-100 sm:text-lg">
        Thank you for purchasing more seats for{' '}
        {product?.name || process.env.NEXT_PUBLIC_SITE_TITLE}!{' '}
        <br className="hidden sm:block" />
        Your purchase is for <strong>{seatsPurchased}</strong> additional seat
        {seatsPurchased > 1 && 's'}.
      </h1>
      <InlineTeamInvite bulkCouponId={bulkCouponId} />
    </>
  )
}

const IndividualToBulkPostPurchasePage: React.FC<
  React.PropsWithChildren<{
    product: SanityProduct
    seatsPurchased: number
    bulkCouponId: string
  }>
> = ({product, seatsPurchased, bulkCouponId}) => {
  return (
    <>
      <h1 className="max-w-md text-lg font-medium text-cyan-100 sm:text-lg">
        Thank you for purchasing more seats for{' '}
        {product?.name || process.env.NEXT_PUBLIC_SITE_TITLE}!{' '}
        <br className="hidden sm:block" />
        Your purchase is for <strong>{seatsPurchased}</strong> additional seat
        {seatsPurchased > 1 && 's'}. You can always add more seats later when
        your team grows.
      </h1>
      <InlineTeamInvite bulkCouponId={bulkCouponId} />
    </>
  )
}

const ThanksVerify: React.FC<
  React.PropsWithChildren<{
    email: string
    seatsPurchased: number
    purchaseType: PurchaseType
    bulkCouponId: string
    product: SanityProduct
  }>
> = ({email, seatsPurchased, purchaseType, bulkCouponId, product}) => {
  let postPurchasePage = null

  switch (purchaseType) {
    case NEW_INDIVIDUAL_PURCHASE:
      postPurchasePage = (
        <NewIndividualPostPurchasePage product={product} email={email} />
      )
      break
    case NEW_BULK_COUPON:
      postPurchasePage = (
        <NewBulkCouponPostPurchasePage
          product={product}
          email={email}
          bulkCouponId={bulkCouponId}
          seatsPurchased={seatsPurchased}
        />
      )
      break
    case EXISTING_BULK_COUPON:
      postPurchasePage = (
        <ExistingBulkCouponPostPurchasePage
          product={product}
          bulkCouponId={bulkCouponId}
          seatsPurchased={seatsPurchased}
        />
      )
      break
    case INDIVIDUAL_TO_BULK_UPGRADE:
      postPurchasePage = (
        <IndividualToBulkPostPurchasePage
          product={product}
          bulkCouponId={bulkCouponId}
          seatsPurchased={seatsPurchased}
        />
      )
      break
  }

  return (
    <PurchaseLayout productImage={product?.image}>
      {postPurchasePage}
      {/* link to invoice here! */}
    </PurchaseLayout>
  )
}

export default ThanksVerify
