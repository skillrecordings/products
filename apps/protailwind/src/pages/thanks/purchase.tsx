import * as React from 'react'
import {GetServerSideProps} from 'next'
import Layout from 'components/layout'
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
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'

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

  const {
    email,
    stripeChargeId,
    quantity: seatsPurchased,
    stripeProduct,
  } = purchaseInfo

  const stripeProductName = stripeProduct.name

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
      stripeProductName,
    },
  }
}

const PurchaseLayout: React.FC<
  React.PropsWithChildren<{
    productImage: {url: string; alt: string} | undefined
  }>
> = ({productImage, children}) => {
  return (
    <Layout footer={null} meta={{title: 'Purchase Successful'}}>
      <main className="relative z-10 flex min-h-screen flex-grow flex-col items-center justify-center px-5 pt-10 pb-28">
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
      <p className="mx-auto max-w-xl pt-5 text-sm text-gray-800 sm:text-base sm:leading-relaxed">
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
    stripeProductName: string
  }>
> = ({product, email, stripeProductName}) => {
  return (
    <>
      <h1 className="max-w-lg text-lg font-medium text-blue-600 sm:text-lg">
        <Balancer>
          Thank you for purchasing{' '}
          {product?.name ||
            stripeProductName ||
            process.env.NEXT_PUBLIC_SITE_TITLE}
          !
        </Balancer>
      </h1>
      <h2 className="font-text mx-auto py-5 text-3xl font-bold lg:text-4xl">
        <Balancer>
          Please check your inbox for a login link that just got sent.
        </Balancer>
      </h2>
      <code className="mb-10 mt-5 flex items-center justify-center gap-2 rounded-lg bg-blue-500/10 px-4 py-3 font-sans text-base font-medium sm:text-lg">
        <MailIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />{' '}
        <span className="text-blue-600">Email sent to:</span> {email}
      </code>
      <p className="mx-auto max-w-xl pt-5 text-sm text-gray-700 sm:text-base sm:leading-relaxed">
        <Balancer>
          As a final step to access the course you need to check your inbox (
          <strong>{email}</strong>) where you will find an email from{' '}
          <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> with a link
          to access your purchase and start learning.
        </Balancer>
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
    stripeProductName: string
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
      <h2 className="font-text mx-auto max-w-lg py-5 text-3xl font-bold lg:text-4xl">
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
    stripeProductName: string
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
    stripeProductName: string
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
    stripeProductName: string
  }>
> = ({
  email,
  seatsPurchased,
  purchaseType,
  bulkCouponId,
  product,
  stripeProductName,
}) => {
  let postPurchasePage = null

  switch (purchaseType) {
    case NEW_INDIVIDUAL_PURCHASE:
      postPurchasePage = (
        <NewIndividualPostPurchasePage
          stripeProductName={stripeProductName}
          product={product}
          email={email}
        />
      )
      break
    case NEW_BULK_COUPON:
      postPurchasePage = (
        <NewBulkCouponPostPurchasePage
          product={product}
          email={email}
          bulkCouponId={bulkCouponId}
          seatsPurchased={seatsPurchased}
          stripeProductName={stripeProductName}
        />
      )
      break
    case EXISTING_BULK_COUPON:
      postPurchasePage = (
        <ExistingBulkCouponPostPurchasePage
          product={product}
          bulkCouponId={bulkCouponId}
          seatsPurchased={seatsPurchased}
          stripeProductName={stripeProductName}
        />
      )
      break
    case INDIVIDUAL_TO_BULK_UPGRADE:
      postPurchasePage = (
        <IndividualToBulkPostPurchasePage
          product={product}
          bulkCouponId={bulkCouponId}
          seatsPurchased={seatsPurchased}
          stripeProductName={stripeProductName}
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
