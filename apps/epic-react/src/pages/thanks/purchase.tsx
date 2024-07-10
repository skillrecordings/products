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
import {getProduct} from '@/lib/products'
import {isEmpty} from 'lodash'
import {Transfer} from '@/purchase-transfer/purchase-transfer'
import {trpc} from '@/trpc/trpc.client'
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
      // purchase: convertToSerializeForNextResponse(purchase),
      purchase: convertToSerializeForNextResponse({
        ...purchase,
        totalAmount: purchase.totalAmount.toString(),
      }),
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
  productSlug,
  productActive,
}: {
  bulkCouponId?: string
  seatsPurchased: number
  productSlug: string
  productActive: boolean
}) => {
  if (!bulkCouponId) return null

  return (
    <div className="mx-auto w-full px-5">
      <h2 className="pb-2 text-sm font-medium">Invite your team</h2>
      <div className="flex flex-col rounded-lg border border-indigo-600/50 p-5">
        <p className="pb-2 font-semibold text-white">
          You have purchased {seatsPurchased} seats.
        </p>
        <p className="pb-2 text-sm">
          Invite your team to claim seats right away with this invite link.
          Don't worry about saving this anywhere, it will always be available on
          your{' '}
          <a
            className="font-semibold underline"
            href={`${process.env.NEXT_PUBLIC_URL}/team`}
          >
            Team page
          </a>{' '}
          once you log in.
        </p>
        <CopyInviteLink
          className="[&_[data-sr-button]]:bg-gray-900/75 [&_[data-sr-button]]:text-primary [&_[data-sr-button]]:text-white [&_[data-sr-button]]:hover:bg-gray-900 [&_[data-sr-button]]:dark:bg-gray-900/75 [&_[data-sr-button]]:dark:text-white [&_[data-sr-button]]:dark:hover:bg-gray-900  [&_input]:border-transparent [&_input]:bg-gray-900 [&_input]:text-sm [&_input]:font-medium [&_input]:dark:bg-gray-900"
          bulkCouponId={bulkCouponId}
          productSlug={productSlug}
          productActive={productActive}
        />
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
    <header className="flex w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        {product?.image && (
          <div className="flex flex-shrink-0 items-center justify-center">
            <Image
              className="overflow-hidden rounded-full"
              src={product.image.url}
              alt={product.title}
              quality={100}
              width={200}
              height={200}
              priority
            />
          </div>
        )}
        <div className="flex flex-col items-center pt-8 text-center">
          <h1 className="font-heading max-w-sm text-lg font-medium sm:text-xl lg:text-2xl">
            <span className="font-heading block pb-2 text-sm font-black uppercase text-yellow-500">
              Success!
            </span>
            <Balancer>{title}</Balancer>
          </h1>
          <p className="pt-5 font-medium">{byline}</p>
        </div>
      </div>
    </header>
  )
}

const LoginLink: React.FC<{email: string}> = ({email}) => {
  return (
    <div className="relative mx-auto flex w-full items-center justify-center gap-5">
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <MailIcon />
          <h2 className="flex flex-col items-center justify-center break-all pt-3 text-center text-xl font-semibold">
            <span className="drop-shadow-sm">Login link sent to:</span>
            <span className="font-normal drop-shadow-sm">{email}</span>
          </h2>
        </div>
        <p className="max-w-sm pt-5 text-center text-sm opacity-90">
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
  let title = `Thank you for purchasing ${stripeProductName}`
  let loginLink = null
  const isProductActive: boolean = product.status === 1
  let inviteTeam = (
    <InlineTeamInvite
      bulkCouponId={bulkCouponId}
      seatsPurchased={seatsPurchased}
      productSlug={product.slug}
      productActive={isProductActive}
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
      <Layout meta={{title: 'Purchase Successful'}}>
        <main className="mx-auto flex w-full max-w-screen-lg flex-col-reverse sm:flex-grow lg:grid lg:grid-cols-9 lg:py-8">
          <div className="col-span-4 flex w-full flex-col items-center justify-center px-5 pb-16 pt-10 sm:px-10 lg:py-16">
            <ThankYou
              title={title}
              byline={byline}
              product={product}
              email={email}
            />
            <div className="w-full max-w-md pt-8">
              <h3 className="pb-2 text-sm font-medium">Your invoice</h3>
              <InvoiceCard
                target="_blank"
                className="w-full p-4 [&_[data-content]]:flex-col [&_[data-content]]:items-start"
                purchase={{product: {name: stripeProductName}, ...purchase}}
              />
            </div>
            <PurchaseTransfer purchase={purchase} />
          </div>
          <div className="col-span-5 flex flex-col items-center justify-center bg-gradient-to-tr from-primary to-indigo-500 pb-10 pt-16 text-white selection:bg-gray-900 sm:pb-24 sm:pt-24 lg:rounded-md">
            <div className="flex max-w-screen-sm flex-col gap-10 sm:px-10 lg:px-16">
              {loginLink && loginLink({email})}
              {inviteTeam && inviteTeam}
            </div>
          </div>
        </main>
      </Layout>
    </>
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
    <div className="pt-5">
      {purchaseUserTransfers && (
        <Transfer
          className="[&_] flex w-full items-start rounded-lg border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 [&_[data-content]]:flex-col [&_[data-content]]:items-start [&_h2]:text-lg [&_h2]:leading-tight [&_p]:text-sm"
          purchaseUserTransfers={purchaseUserTransfers}
          refetch={refetch}
        />
      )}
    </div>
  )
}

export default ThanksVerify

const MailIcon = () => {
  return (
    <div className="w-16">
      <Image
        src="/assets/rocket@2x.png"
        width={126}
        height={220}
        alt="rocket"
      />
    </div>
  )
}
