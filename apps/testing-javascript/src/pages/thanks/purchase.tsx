import * as React from 'react'
import {GetServerSideProps} from 'next'
import Layout from '@/components/layout'
import {
  convertToSerializeForNextResponse,
  type PurchaseType,
} from '@skillrecordings/commerce-server'
import type {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {
  EXISTING_BULK_COUPON,
  INDIVIDUAL_TO_BULK_UPGRADE,
  NEW_BULK_COUPON,
  NEW_INDIVIDUAL_PURCHASE,
} from '@skillrecordings/types'
import {getSdk, Purchase} from '@skillrecordings/database'
import CopyInviteLink from '@skillrecordings/skill-lesson/team/copy-invite-link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import {first} from 'lodash'
import {getAllProducts} from '@/server/products.server'
import {type SanityDocument} from '@sanity/client'
import {InvoiceCard} from '@/pages/invoices'
import {MailIcon} from '@heroicons/react/solid'
import {paymentOptions} from '../api/skill/[...skillRecordings]'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {query} = context

  const provider =
    (query.provider instanceof Array ? query.provider[0] : query.provider) ||
    'stripe'
  const session_id =
    query.session_id instanceof Array ? query.session_id[0] : query.session_id

  const paymentProvider = paymentOptions.getProvider(provider)

  if (!session_id || !paymentProvider) {
    return {
      notFound: true,
    }
  }

  const purchaseInfo = await paymentProvider.getPurchaseInfo(session_id)

  const {
    email,
    chargeIdentifier,
    quantity: seatsPurchased,
    product,
    purchaseType,
  } = purchaseInfo

  const stripeProductName = product.name

  const purchase = await getSdk().getPurchaseForStripeCharge(chargeIdentifier)

  if (!purchase || !email) {
    return {
      notFound: true,
    }
  }

  const products = await getAllProducts()
  const purchasedProduct = first(
    products.filter(
      (product: SanityProduct) => product.productId === purchase.productId,
    ),
  )

  return {
    props: {
      purchase: convertToSerializeForNextResponse(purchase),
      email,
      seatsPurchased,
      purchaseType,
      bulkCouponId: purchase.bulkCoupon?.id || null,
      product: purchasedProduct || null,
      stripeProductName,
    },
  }
}

const InlineTeamInvite = ({
  bulkCouponId,
  seatsPurchased,
}: {
  bulkCouponId?: string
  seatsPurchased: number
}) => {
  if (!bulkCouponId) return null

  return (
    <div className="mx-auto w-full">
      <h2 className="pb-2 font-heading text-sm font-black uppercase">
        Invite your team
      </h2>
      <div className="flex flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-xl shadow-gray-400/5">
        <p className="pb-2 font-semibold">
          You have purchased {seatsPurchased} seats.
        </p>
        <p className="pb-2">
          Invite your team to claim seats right away with this invite link.
          Don't worry about saving this anywhere, it will always be available on
          your{' '}
          <a
            className="font-semibold underline"
            href={`${process.env.NEXT_PUBLIC_URL}/team`}
          >
            Team page
          </a>{' '}
          once you sign in.
        </p>
        <CopyInviteLink bulkCouponId={bulkCouponId} />
      </div>
    </div>
  )
}

type ThankYouProps = {
  email: string
  product: SanityDocument
  title: string
  byline: JSX.Element | null
}

const ThankYou: React.FC<ThankYouProps> = ({title, byline, product, email}) => {
  return (
    <header className="mx-auto w-full">
      <div className="flex flex-col items-center gap-10 sm:flex-row">
        {product?.image?.url && (
          <div className="flex flex-shrink-0 items-center justify-center">
            <Image
              src={product.image.url}
              alt={product.title}
              width={250}
              height={250}
            />
          </div>
        )}
        <div className="flex flex-col items-start">
          <h1 className="font-heading text-3xl font-black sm:text-3xl lg:text-4xl">
            <span className="block pb-4 font-heading text-sm font-black uppercase text-brand-red">
              Success!
            </span>
            {title}
          </h1>
          <p className="pt-5 font-medium">{byline}</p>
        </div>
      </div>
    </header>
  )
}

const LoginLink: React.FC<{email: string}> = ({email}) => {
  return (
    <div className="relative mx-auto flex w-full items-center justify-between gap-5 overflow-hidden rounded-xl bg-brand-red p-7 shadow-2xl shadow-gray-400/20 selection:bg-white selection:text-brand-red sm:p-12">
      <div className="relative z-10">
        <p className="inline-flex rounded-full bg-white px-3 py-1 font-heading text-xs font-black uppercase text-brand-red sm:text-sm">
          Final step
        </p>
        <h2 className="mx-auto py-5 font-heading text-2xl font-black sm:text-3xl lg:text-4xl">
          <Balancer>
            Please check your inbox for a <i>login link</i> that just got sent.
          </Balancer>
        </h2>
        <div className="mb-3 inline-flex items-center gap-1 rounded-lg bg-white/20 px-4 py-3">
          <MailIcon className="h-5 w-5 flex-shrink-0" />{' '}
          <strong className="inline-block break-all font-semibold">
            Email sent to: {email}
          </strong>
        </div>
        <p className="mx-auto text-sm font-medium leading-relaxed sm:text-base">
          As a final step to access the course you need to check your inbox (
          <strong>{email}</strong>) where you will find an email from{' '}
          <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> with a link
          to access your purchase and start learning.
        </p>
      </div>
    </div>
  )
}

const ThanksVerify: React.FC<
  React.PropsWithChildren<{
    email: string
    seatsPurchased: number
    purchaseType: PurchaseType
    bulkCouponId: string
    product: SanityDocument
    stripeProductName: string
    purchase: Purchase
  }>
> = ({
  email,
  seatsPurchased,
  purchaseType,
  bulkCouponId,
  product,
  stripeProductName,
  purchase,
}) => {
  let byline = null
  let title = `Thank you for purchasing ${stripeProductName}`
  let loginLink = null
  let inviteTeam = (
    <InlineTeamInvite
      bulkCouponId={bulkCouponId}
      seatsPurchased={seatsPurchased}
    />
  )

  switch (purchaseType) {
    case NEW_INDIVIDUAL_PURCHASE:
      loginLink = LoginLink
      break
    case NEW_BULK_COUPON:
      byline = (
        <>
          Your purchase is for <strong>{seatsPurchased}</strong> seat
          {seatsPurchased > 1 && 's'}. You can always add more seats later when
          your team grows.
        </>
      )
      loginLink = LoginLink
      break
    case EXISTING_BULK_COUPON:
      title = `Thank you for purchasing more seats for ${
        product?.name || process.env.NEXT_PUBLIC_SITE_TITLE
      }!`
      byline = (
        <>
          Your purchase is for <strong>{seatsPurchased}</strong> additional seat
          {seatsPurchased > 1 && 's'}. You can always add more seats later when
          your team grows.
        </>
      )

      break
    case INDIVIDUAL_TO_BULK_UPGRADE:
      title = `Thank you for purchasing more seats for ${
        product?.name || process.env.NEXT_PUBLIC_SITE_TITLE
      }!`
      byline = (
        <>
          Your purchase is for <strong>{seatsPurchased}</strong> additional seat
          {seatsPurchased > 1 && 's'}. You can always add more seats later when
          your team grows.
        </>
      )

      break
  }

  return (
    <>
      <Layout footer={null} meta={{title: 'Purchase Successful'}}>
        <main className="mx-auto flex w-full max-w-screen-md flex-col gap-8 px-5 py-10">
          <ThankYou
            title={title}
            byline={byline}
            product={product}
            email={email}
          />

          {inviteTeam && inviteTeam}
          {loginLink && loginLink({email})}
          <div>
            <h2 className="pb-2 font-heading text-sm font-black uppercase">
              Get your invoice
            </h2>
            <InvoiceCard
              purchase={{product: {name: stripeProductName}, ...purchase}}
            />
          </div>
        </main>
      </Layout>
    </>
  )
}

export default ThanksVerify
