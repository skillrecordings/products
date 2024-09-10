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
import pluralize from 'pluralize'

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
    <div className="mx-auto w-full">
      <h2 className="pb-2 text-lg font-semibold">Invite your team</h2>
      <div className="flex flex-col rounded-lg border border-white/20 p-5">
        <p className="pb-2 font-semibold text-white">
          You have purchased {seatsPurchased}{' '}
          {pluralize('seat', seatsPurchased)}.
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
          className="[&>div]:gap-2 [&_[data-sr-button]]:bg-gray-900 [&_[data-sr-button]]:text-primary [&_[data-sr-button]]:text-white [&_[data-sr-button]]:hover:bg-gray-900 [&_[data-sr-button]]:dark:bg-gray-900 [&_[data-sr-button]]:dark:text-white [&_[data-sr-button]]:dark:hover:bg-gray-900  [&_input]:border-transparent [&_input]:bg-gray-900 [&_input]:text-sm [&_input]:font-medium [&_input]:dark:bg-gray-900"
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
        <div className="flex flex-col items-center text-center">
          <h1 className="font-heading max-w-sm text-lg font-medium sm:text-xl lg:text-2xl">
            <span className="font-heading block pb-2 text-sm font-black uppercase text-emerald-600 dark:text-emerald-300">
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
            <span className="mb-2 text-2xl font-bold drop-shadow-sm">
              Check Your Email
            </span>
            <span className="font-semibold drop-shadow-sm">
              Login link sent to: {email}
            </span>
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
            <div className="w-full pt-8">
              <h3 className="pb-2 text-base font-semibold">Your invoice</h3>
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

  return purchaseUserTransfers ? (
    <div className="">
      {purchaseUserTransfers && (
        <>
          <h3 className="mt-5 pb-2 text-base font-semibold">
            Transfer this purchase to another email address
          </h3>
          <Transfer
            withTitle={false}
            className="[&_] flex w-full items-start rounded-lg border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 [&_[data-content]]:flex-col [&_[data-content]]:items-start [&_h2]:text-lg [&_h2]:leading-tight [&_p]:text-sm"
            purchaseUserTransfers={purchaseUserTransfers}
            refetch={refetch}
          />
        </>
      )}
    </div>
  ) : null
}

export default ThanksVerify

const MailIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="102"
      height="107"
      fill="none"
      viewBox="0 0 102 107"
    >
      <path
        fill="#5A6396"
        d="M50.792 84.5c-.413 0-.824-.115-1.186-.344L1.023 53.239a2.21 2.21 0 0 1 .199-3.84l49.57-31.149 49.571 31.148a2.21 2.21 0 0 1 .198 3.84L51.978 84.157a2.21 2.21 0 0 1-1.186.344Z"
      />
      <path
        fill="url(#a)"
        d="M83.917 86.708h-66.25v-79.5A2.21 2.21 0 0 1 19.876 5h61.833a2.21 2.21 0 0 1 2.208 2.208v79.5Z"
      />
      <path
        fill="#414B87"
        d="M99.376 106.583c-.186 0-.374-.024-.557-.07l-50.792-13.25.557-15.388 53-26.5v53c0 .685-.318 1.329-.859 1.749-.389.3-.866.459-1.35.459Z"
      />
      <path
        fill="#2F3767"
        d="M99.376 106.583H2.209A2.207 2.207 0 0 1 0 104.375v-53l100.433 51.061a2.207 2.207 0 0 1-1.058 4.147Z"
      />
      <rect width="34" height="14" x="34" y="39" fill="#5D6DEA" rx="3" />
      <path
        fill="#fff"
        d="M40.674 49v-5.818h1.23v4.804h2.494V49h-3.724Zm6.488.085c-.442 0-.823-.093-1.145-.281a1.925 1.925 0 0 1-.742-.79 2.545 2.545 0 0 1-.261-1.179c0-.45.087-.845.261-1.182.175-.339.422-.602.742-.79.322-.189.703-.283 1.145-.283.44 0 .822.094 1.142.284.322.187.57.45.744.79.174.336.261.73.261 1.181 0 .447-.087.84-.261 1.18-.174.336-.422.6-.744.789-.32.188-.701.281-1.142.281Zm.005-.937a.754.754 0 0 0 .503-.17c.135-.116.236-.273.304-.472.07-.2.105-.425.105-.68 0-.253-.035-.48-.105-.678a1.058 1.058 0 0 0-.304-.472.745.745 0 0 0-.503-.173.77.77 0 0 0-.511.173c-.136.116-.24.273-.31.472a2.09 2.09 0 0 0-.102.679c0 .254.034.48.102.679.07.199.174.356.31.471a.78.78 0 0 0 .511.17Zm4.895 2.58c-.392 0-.728-.055-1.008-.163-.279-.106-.5-.25-.665-.434a1.338 1.338 0 0 1-.321-.62l1.12-.15a.732.732 0 0 0 .161.244.786.786 0 0 0 .293.182c.123.047.272.071.449.071.263 0 .48-.064.65-.193.172-.127.259-.34.259-.64v-.798h-.051a1.15 1.15 0 0 1-.24.344 1.203 1.203 0 0 1-.408.264 1.572 1.572 0 0 1-.597.102c-.328 0-.626-.075-.895-.227a1.63 1.63 0 0 1-.639-.702c-.157-.316-.236-.715-.236-1.198 0-.495.08-.907.242-1.239.16-.331.375-.58.642-.744a1.66 1.66 0 0 1 .883-.247c.245 0 .45.041.614.125.165.081.297.183.398.306.102.122.18.24.236.358h.045v-.733h1.202v4.407c0 .37-.091.681-.273.931-.182.25-.434.438-.756.563-.32.127-.688.19-1.105.19Zm.026-2.7a.82.82 0 0 0 .494-.145.92.92 0 0 0 .313-.42c.073-.184.11-.403.11-.659s-.036-.477-.108-.665a.972.972 0 0 0-.312-.44.795.795 0 0 0-.497-.156.785.785 0 0 0-.503.162.972.972 0 0 0-.31.443c-.07.19-.105.408-.105.656 0 .252.035.47.105.653a.948.948 0 0 0 .31.424.836.836 0 0 0 .503.147Zm3.07.972v-4.364h1.211V49h-1.21Zm.609-4.926a.658.658 0 0 1-.463-.18.58.58 0 0 1-.19-.434c0-.166.063-.31.19-.429a.652.652 0 0 1 .463-.182c.18 0 .333.061.46.182.129.12.193.263.193.43a.576.576 0 0 1-.193.434.648.648 0 0 1-.46.179Zm2.782 2.403V49h-1.21v-4.364h1.153v.77h.051a1.22 1.22 0 0 1 .486-.602 1.47 1.47 0 0 1 .826-.224c.303 0 .568.066.793.198.225.133.4.322.526.569a1.9 1.9 0 0 1 .187.875V49h-1.21v-2.563c.002-.267-.066-.475-.205-.624-.138-.152-.328-.228-.57-.228a.87.87 0 0 0-.432.105.732.732 0 0 0-.29.307 1.061 1.061 0 0 0-.105.48Z"
      />
      <circle cx="80" cy="9" r="9" fill="#ED5B4C" />
      <path
        fill="#fff"
        d="M81.046 6.182V12h-1.23V7.35h-.034l-1.333.835V7.094l1.44-.912h1.157Z"
      />
      <rect
        width="40"
        height="6"
        x="31"
        y="18"
        fill="#27316F"
        opacity=".2"
        rx="1"
      />
      <rect
        width="26"
        height="3"
        x="38"
        y="27"
        fill="#27316F"
        opacity=".2"
        rx="1"
      />
      <defs>
        <linearGradient
          id="a"
          x1="50.792"
          x2="50.792"
          y1="5"
          y2="86.708"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E6E6E6" />
          <stop offset="1" stopColor="#E9E9E9" />
        </linearGradient>
      </defs>
    </svg>
  )
}
