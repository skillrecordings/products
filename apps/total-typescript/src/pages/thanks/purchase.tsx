import * as React from 'react'
import {GetServerSideProps} from 'next'
import Layout from '@/components/app/layout'
import {
  convertToSerializeForNextResponse,
  PurchaseType,
} from '@skillrecordings/commerce-server'
import {
  EXISTING_BULK_COUPON,
  INDIVIDUAL_TO_BULK_UPGRADE,
  NEW_BULK_COUPON,
  NEW_INDIVIDUAL_PURCHASE,
} from '@skillrecordings/types'
import {getSdk, Purchase} from '@skillrecordings/database'
import CopyInviteLink from '@skillrecordings/skill-lesson/team/copy-invite-link'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import {SanityDocument} from '@sanity/client'
import {InvoiceCard} from '@/pages/invoices'
import {MailIcon} from '@heroicons/react/solid'
import {getProduct} from '@skillrecordings/skill-lesson/path-to-purchase/products.server'
import {trpc} from '@/trpc/trpc.client'
import {isEmpty} from 'lodash'
import {Transfer} from '@/purchase-transfer/purchase-transfer'
import {paymentOptions} from '../api/skill/[...skillRecordings]'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {query} = context

  const session_id =
    query.session_id instanceof Array ? query.session_id[0] : query.session_id

  const paymentProvider = paymentOptions.providers.stripe

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
    product: merchantProduct,
    purchaseType,
  } = purchaseInfo

  const stripeProductName = merchantProduct.name

  const purchase = await getSdk().getPurchaseForStripeCharge(chargeIdentifier)

  if (!purchase || !email) {
    return {
      notFound: true,
    }
  }

  const product = await getProduct(purchase.productId)

  return {
    props: {
      purchase: convertToSerializeForNextResponse(purchase),
      email,
      seatsPurchased,
      purchaseType,
      bulkCouponId: purchase.bulkCoupon?.id || null,
      product: product || null,
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
      <h2 className="pb-2 text-sm font-semibold uppercase tracking-wide">
        Invite your team
      </h2>
      <div className="flex flex-col rounded-lg border border-gray-700/30 bg-gray-800 p-5 shadow-xl shadow-black/10">
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

const PurchaseTransfer: React.FC<{
  bulkCouponId?: string
  purchase: {id: string; userId: string | null}
}> = ({bulkCouponId, purchase}) => {
  const {data: purchaseUserTransfers, refetch} =
    trpc.purchaseUserTransfer.forPurchaseId.useQuery({
      id: purchase.id,
      sourceUserId: purchase.userId || undefined,
    })

  if (bulkCouponId) return null
  if (isEmpty(purchaseUserTransfers)) return null

  return (
    <div>
      <h2 className="pb-2 text-sm font-semibold uppercase tracking-wide">
        Transfer this purchase to another email address
      </h2>
      {purchaseUserTransfers && (
        <Transfer
          purchaseUserTransfers={purchaseUserTransfers}
          refetch={refetch}
        />
      )}
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
        {product?.image && (
          <div className="flex flex-shrink-0 items-center justify-center">
            <Image
              src={product.image.url}
              alt={product.title}
              width={250}
              height={250}
            />
          </div>
        )}
        <div className="flex w-full flex-col items-start">
          <h1 className="w-full text-lg font-semibold sm:text-xl lg:text-2xl">
            <span className="block pb-4 text-sm font-semibold uppercase text-primary">
              Success!
            </span>
            <span className="w-full text-balance">{title}</span>
          </h1>
          <p className="pt-5 text-lg font-normal text-gray-100">
            <Balancer>{byline}</Balancer>
          </p>
        </div>
      </div>
    </header>
  )
}

export const LoginLink: React.FC<{email: string}> = ({email}) => {
  return (
    <div className="relative mx-auto flex w-full items-center justify-between gap-5 overflow-hidden rounded-xl border bg-card p-7 shadow-2xl sm:p-12">
      <div className="relative z-10">
        <p className="inline-flex rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase text-primary sm:text-sm">
          Final step
        </p>
        <h2 className="mx-auto text-balance py-5 text-xl font-bold sm:text-2xl lg:text-3xl">
          Please check your inbox for a <strong>login link</strong> that just
          got sent.
        </h2>
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-gray-900 shadow-lg shadow-cyan-600/20">
          <MailIcon className="h-5 w-5 flex-shrink-0 text-slate-900/40" />{' '}
          <strong className="inline-block break-all font-semibold">
            Email sent to: {email}
          </strong>
        </div>
        <p className="mx-auto pt-5 font-medium leading-relaxed text-white/90 sm:text-base sm:leading-relaxed">
          <Balancer>
            As a final step to access the course you need to check your inbox (
            <strong>{email}</strong>) where you will find an email from{' '}
            <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> with a link
            to access your purchase and start learning.
          </Balancer>
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
  let title = `Thank you for purchasing Total TypeScript ${stripeProductName}`
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
        <main className="mx-auto flex w-full max-w-screen-md flex-col gap-8 px-5 py-24">
          <ThankYou
            title={title}
            byline={byline}
            product={product}
            email={email}
          />
          {inviteTeam && inviteTeam}
          {loginLink && loginLink({email})}
          <div>
            <h2 className="pb-2 text-sm font-semibold uppercase tracking-wide">
              Get your invoice
            </h2>
            <InvoiceCard
              purchase={{product: {name: stripeProductName}, ...purchase}}
            />
          </div>
          <PurchaseTransfer purchase={purchase} />
        </main>
      </Layout>
    </>
  )
}

export default ThanksVerify
