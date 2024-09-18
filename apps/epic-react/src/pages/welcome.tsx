import * as React from 'react'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import type {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {signIn, useSession} from 'next-auth/react'
import {type GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import Layout from '@/components/app/layout'
import {getSdk, prisma} from '@skillrecordings/database'
import Link from 'next/link'
import {first, isString} from 'lodash'
import InviteTeam from '@skillrecordings/skill-lesson/team'
import {InvoiceCard} from '@/pages/invoices'
import {getAllProducts} from '@/lib/products'
import {getLegacyModule, LegacyModule} from '@/lib/legacy-modules'
import Image from 'next/legacy/image'
import {trpc} from '@/trpc/trpc.client'
import {Transfer} from '@/purchase-transfer/purchase-transfer'
import {paymentOptions} from './api/skill/[...skillRecordings]'
import FancyButton from '@/components/fancy-button'
import {Icon} from '@skillrecordings/skill-lesson/icons'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {purchaseId: purchaseQueryParam, upgrade} = query
  const provider =
    (query.provider instanceof Array ? query.provider[0] : query.provider) ||
    'stripe'
  const session_id =
    query.session_id instanceof Array ? query.session_id[0] : query.session_id
  const token = await getToken({req})
  const {getPurchaseDetails} = getSdk()

  const paymentProvider = paymentOptions.getProvider(provider)

  let purchaseId = purchaseQueryParam

  if (session_id && paymentProvider) {
    const {chargeIdentifier} = await paymentProvider.getPurchaseInfo(session_id)

    const purchase = await prisma.purchase.findFirst({
      where: {
        merchantCharge: {
          identifier: chargeIdentifier,
        },
      },
    })

    if (purchase) {
      purchaseId = purchase.id
    } else {
      return {
        redirect: {
          destination: `/thanks/purchase?session_id=${session_id}`,
          permanent: false,
        },
      }
    }
  }

  if (token && isString(purchaseId) && isString(token?.sub)) {
    const {purchase, existingPurchase, availableUpgrades} =
      await getPurchaseDetails(purchaseId, token.sub)

    if (purchase) {
      const products = await getAllProducts()
      const purchasedProduct = first(
        products.filter(
          (product: SanityProduct) => product.productId === purchase.product.id,
        ),
      ) as SanityProduct

      const firstLegacyModule = purchasedProduct.modules
        ? await getLegacyModule(purchasedProduct.modules[0].slug)
        : null

      return {
        props: {
          product: purchasedProduct,
          purchase: convertToSerializeForNextResponse(purchase),
          existingPurchase,
          availableUpgrades,
          upgrade: upgrade === 'true',
          firstLegacyModule: firstLegacyModule,
        },
      }
    } else {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      }
    }
  }

  return {
    redirect: {
      destination: `/`,
      permanent: false,
    },
  }
}

type Purchase = {
  id: string
  merchantChargeId: string | null
  bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
  product: {id: string; name: string}
}

type PersonalPurchase = {
  id: string
  product: {
    id: string
    name: string
  }
}

const Welcome: React.FC<
  React.PropsWithChildren<{
    purchase: Purchase
    existingPurchase: {
      id: string
      product: {id: string; name: string}
    }
    token: any
    availableUpgrades: {upgradableTo: {id: string; name: string}}[]
    upgrade: boolean
    product?: SanityProduct
    firstLegacyModule?: LegacyModule
  }>
> = ({
  upgrade,
  purchase,
  token,
  existingPurchase,
  availableUpgrades,
  product,
  firstLegacyModule,
}) => {
  const {data: session, status} = useSession()
  const [personalPurchase, setPersonalPurchase] = React.useState<
    PersonalPurchase | Purchase
  >(purchase.bulkCoupon ? existingPurchase : purchase)

  const redemptionsLeft =
    purchase.bulkCoupon &&
    purchase.bulkCoupon.maxUses > purchase.bulkCoupon.usedCount

  const hasCharge = Boolean(purchase.merchantChargeId)

  const {data: purchaseUserTransfers, refetch} =
    trpc.purchaseUserTransfer.forPurchaseId.useQuery({
      id: purchase.id,
    })

  const isTransferAvailable =
    !purchase.bulkCoupon &&
    Boolean(
      purchaseUserTransfers?.filter((purchaseUserTransfer) =>
        ['AVAILABLE', 'INITIATED', 'COMPLETED'].includes(
          purchaseUserTransfer.transferState,
        ),
      ).length,
    )

  return (
    <Layout
      meta={{title: `Welcome to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
      footer={null}
    >
      <main
        className="mx-auto flex w-full flex-grow flex-col items-center justify-center px-5 pb-32 pt-10"
        id="welcome"
      >
        <div className="flex w-full max-w-screen-md flex-col gap-3">
          <Header
            product={product}
            upgrade={upgrade}
            purchase={purchase}
            personalPurchase={personalPurchase}
            firstLegacyModule={firstLegacyModule}
          />
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="pb-2 text-lg font-semibold tracking-tight">
                Share {purchase.product.name}
              </h2>
              <Share productName={purchase.product.name} />
            </div>
            {redemptionsLeft && (
              <div>
                <h2 className="pb-2 text-lg font-semibold tracking-tight">
                  Invite your team
                </h2>
                <Invite
                  setPersonalPurchase={setPersonalPurchase}
                  session={session}
                  purchase={purchase}
                  existingPurchase={existingPurchase}
                />
              </div>
            )}
            {hasCharge && (
              <div>
                <h2 className="pb-2 text-lg font-semibold tracking-tight">
                  Get your invoice
                </h2>
                <InvoiceCard purchase={purchase} />
              </div>
            )}
            {isTransferAvailable && purchaseUserTransfers && (
              <div>
                <h2 className="pb-2 text-lg font-semibold tracking-tight">
                  Transfer this purchase to another email address
                </h2>
                <Transfer
                  purchaseUserTransfers={purchaseUserTransfers}
                  refetch={refetch}
                  withTitle={false}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}

const Header: React.FC<
  React.PropsWithChildren<{
    upgrade: boolean
    purchase: Purchase
    personalPurchase?: PersonalPurchase | Purchase
    product?: SanityProduct
    firstLegacyModule?: LegacyModule
  }>
> = ({upgrade, purchase, product, personalPurchase, firstLegacyModule}) => {
  const moduleSlug = firstLegacyModule?.slug?.current
    ? firstLegacyModule.slug.current
    : product?.modules[0].slug

  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: moduleSlug,
    })

  const firstLessonUrl = firstLegacyModule
    ? `/modules/${firstLegacyModule.slug.current}/${firstLegacyModule.resources[0].slug}`
    : `/workshops/${moduleSlug}/${moduleProgress?.nextLesson?.slug}`
  return (
    <header>
      <div className="flex flex-col items-center gap-10 pb-8 sm:flex-row">
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
          <h1 className="font-heading text-3xl font-semibold sm:text-3xl lg:text-4xl">
            <span className="font-heading block pb-4 text-sm font-semibold uppercase text-text">
              {upgrade ? `You've Upgraded ` : `Welcome to `}
            </span>
            {purchase.product.name}
          </h1>
          <div className="flex items-center space-x-4">
            {personalPurchase && product && (
              <>
                <FancyButton tag="link" href={firstLessonUrl}>
                  Start Learning
                </FancyButton>
                <button
                  className={
                    'relative mt-8 flex transform items-center space-x-1 overflow-hidden rounded-lg bg-blue-500 px-5 py-3 align-middle font-bold text-white transition-all duration-150 ease-in-out hover:scale-110 hover:bg-blue-600 hover:shadow-lg'
                  }
                  onClick={() => signIn('discord')}
                >
                  <Icon name="Discord" size="20" />
                  <span>Connect to Discord</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* {purchase.bulkCoupon
        ? `${purchase.product?.name} team license!`
        : `${purchase.product?.name} license!`} */}
    </header>
  )
}

const Invite: React.FC<React.PropsWithChildren<any>> = ({
  setPersonalPurchase,
  session,
  purchase,
  existingPurchase,
}) => {
  return (
    <InviteTeam
      setPersonalPurchase={setPersonalPurchase}
      session={session}
      purchase={purchase}
      existingPurchase={existingPurchase}
    />
  )
}

const Share: React.FC<React.PropsWithChildren<{productName: string}>> = ({
  productName,
}) => {
  const tweet = `https://twitter.com/intent/tweet/?text=${productName} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER} 🧙 https%3A%2F%2Fwww.epicreact.dev%2F`
  return (
    <div className="flex flex-col justify-between gap-5 rounded-lg border border-er-gray-100 bg-background px-5 py-6 text-text dark:border-er-gray-200 sm:flex-row sm:items-center">
      <p>
        Tell your friends about {process.env.NEXT_PUBLIC_SITE_TITLE},{' '}
        <br className="hidden sm:block" />
        it would help me to get a word out.{' '}
        <span role="img" aria-label="smiling face">
          😊
        </span>
      </p>
      <a
        href={tweet}
        rel="noopener noreferrer"
        target="_blank"
        className="font-heading flex items-center gap-2 self-start rounded-full bg-black px-5 py-2.5 font-semibold text-white transition hover:bg-[#333333] dark:bg-white dark:text-black dark:hover:bg-[#efefef]"
      >
        <XIcon /> Share with your friends!
      </a>
    </div>
  )
}

export const XIcon = () => (
  <svg
    aria-hidden="true"
    height="24"
    width="24"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M17.969 14.162L26.706 4h-2.07l-7.587 8.824L10.989 4H4l9.163 13.343L4 28h2.07l8.013-9.318 6.4 9.318h6.988l-9.503-13.838zm-2.836 3.299l-.929-1.329L6.817 5.56h3.18l5.962 8.532.928 1.329 7.75 11.09h-3.18l-6.324-9.05z"
    />
  </svg>
)

export default Welcome
