import * as React from 'react'
import {
  convertToSerializeForNextResponse,
  stripeData,
} from '@skillrecordings/commerce-server'
import Balancer from 'react-wrap-balancer'
import {getProviders, signIn, useSession} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import Layout from '@/components/app/layout'
import {getSdk, prisma} from '@skillrecordings/database'
import Link from 'next/link'
import {isString} from 'lodash'
import InviteTeam from '@skillrecordings/skill-lesson/team'
import {InvoiceCard} from '@/pages/invoices'
import MuxPlayer from '@mux/mux-player-react'
import {SanityDocument} from '@sanity/client'
import Image from 'next/legacy/image'
import {trpc} from '../../trpc/trpc.client'
import {Transfer} from '@/purchase-transfer/purchase-transfer'
import {getProduct} from '@skillrecordings/skill-lesson/path-to-purchase/products.server'
import {Icon} from '@skillrecordings/skill-lesson/icons'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {purchaseId: purchaseQueryParam, session_id, upgrade} = query
  const token = await getToken({req})
  const providers = await getProviders()
  const {getPurchaseDetails} = getSdk()

  let purchaseId = purchaseQueryParam

  if (session_id) {
    const {stripeChargeId} = await stripeData({
      checkoutSessionId: session_id as string,
    })
    const purchase = await prisma.purchase.findFirst({
      where: {
        merchantCharge: {
          identifier: stripeChargeId,
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
      const product = await getProduct(purchase.product.id)

      return {
        props: {
          product,
          purchase: convertToSerializeForNextResponse(purchase),
          existingPurchase,
          availableUpgrades,
          upgrade: upgrade === 'true',
          providers,
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
    product?: SanityDocument
    providers?: any
  }>
> = ({
  upgrade,
  purchase,
  token,
  existingPurchase,
  availableUpgrades,
  product,
  providers = {},
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
        className="mx-auto flex w-full flex-grow flex-col items-center justify-center px-5 pb-32 pt-24"
        id="welcome"
      >
        <div className="flex w-full max-w-screen-md flex-col gap-3">
          <Header
            product={product}
            upgrade={upgrade}
            purchase={purchase}
            personalPurchase={personalPurchase}
            providers={providers}
          />
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="pb-2 font-semibold uppercase tracking-wide">
                Introduction
              </h2>
              <MuxPlayer
                poster={
                  'https://res.cloudinary.com/total-typescript/image/upload/v1676385817/welcome-video-thumbnail_2x_luri3y.png'
                }
                className="overflow-hidden rounded-md shadow-2xl shadow-black/30"
                playbackId="MP73OYRQ01024QL600kKBwdASaMc49me8008U4Il8og0202xE"
              />
            </div>
            <div>
              <h2 className="pb-2 font-semibold uppercase tracking-wide">
                Share {process.env.NEXT_PUBLIC_SITE_TITLE}
              </h2>
              <Share productName={purchase.product.name} />
            </div>

            {redemptionsLeft && (
              <div>
                <h2 className="pb-2 font-semibold uppercase tracking-wide">
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
                <h2 className="pb-2 font-semibold uppercase tracking-wide">
                  Get your invoice
                </h2>
                <InvoiceCard purchase={purchase} />
              </div>
            )}
            {isTransferAvailable && purchaseUserTransfers && (
              <div>
                <h2 className="pb-2 font-semibold uppercase tracking-wide">
                  Transfer this purchase to another email address
                </h2>
                <Transfer
                  purchaseUserTransfers={purchaseUserTransfers}
                  refetch={refetch}
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
    product?: SanityDocument
    providers?: any
  }>
> = ({upgrade, purchase, product, personalPurchase, providers = {}}) => {
  const githubProvider = providers.github
  const {data: isGithubConnected, status} = trpc.user.githubConnected.useQuery()

  return (
    <header>
      <div className="flex flex-col items-center gap-10 pb-8 sm:flex-row">
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
        <div className="flex w-full flex-col items-center text-center sm:items-start sm:text-left">
          <h1 className="w-full font-text text-3xl font-bold sm:text-3xl lg:text-4xl">
            <span className="block pb-4 font-sans text-sm font-semibold uppercase tracking-wide text-cyan-300">
              {upgrade ? `You've Upgraded ` : `Welcome to `}
            </span>
            <Balancer>Total TypeScript {purchase.product.name}</Balancer>
          </h1>
          {personalPurchase && (
            <div>
              <div className="flex flex-wrap justify-center gap-3 pt-8 sm:justify-start">
                <Link
                  href={`/workshops/${product?.modules[0]?.slug.current}`}
                  className="w-full rounded-lg bg-cyan-400 px-5 py-3 text-lg font-semibold text-gray-900 shadow-xl shadow-black/10 transition hover:brightness-110 sm:w-auto"
                >
                  Start Learning
                </Link>
                {githubProvider &&
                status !== 'loading' &&
                !isGithubConnected ? (
                  <button
                    onClick={() => signIn(githubProvider.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-5 py-3 text-lg font-semibold text-white shadow-xl shadow-black/10 transition hover:brightness-110 sm:w-auto"
                  >
                    <Icon name="Github" size="20" />
                    Connect {githubProvider.name}
                  </button>
                ) : null}
              </div>
            </div>
          )}
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
  const tweet = `https://twitter.com/intent/tweet/?text=Total TypeScript ${productName} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER} 🧙 ${process.env.NEXT_PUBLIC_URL}`
  return (
    <div className="flex flex-col justify-between gap-5 rounded-lg border border-gray-700/30 bg-gray-800 px-5 py-6 shadow-xl shadow-black/10 sm:flex-row sm:items-center">
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
        className="flex items-center gap-2 self-start rounded-md border border-cyan-500 px-5 py-2.5 font-semibold text-cyan-400 transition hover:bg-cyan-600/20"
      >
        <TwitterIcon /> Share with your friends!
      </a>
    </div>
  )
}

export const TwitterIcon = () => (
  <svg
    aria-hidden="true"
    height="16"
    width="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <path d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z" />
    </g>
  </svg>
)

export default Welcome
