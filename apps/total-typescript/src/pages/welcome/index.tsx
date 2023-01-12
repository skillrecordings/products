import * as React from 'react'
import {DocumentTextIcon, UserGroupIcon} from '@heroicons/react/outline'
import {
  convertToSerializeForNextResponse,
  stripeData,
} from '@skillrecordings/commerce-server'
import {useSession} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import Layout from 'components/app/layout'
import {getSdk, prisma} from '@skillrecordings/database'
import Link from 'next/link'
import {isString} from 'lodash'
import InviteTeam from 'team'
import {InvoiceCard} from 'pages/invoices'
import MuxPlayer from '@mux/mux-player-react'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {purchaseId: purchaseQueryParam, session_id, upgrade} = query
  const token = await getToken({req})
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
    return purchase
      ? {
          props: {
            purchase: convertToSerializeForNextResponse(purchase),
            existingPurchase,
            availableUpgrades,
            upgrade: upgrade === 'true',
          },
        }
      : {
          redirect: {
            destination: `/`,
            permanent: false,
          },
        }
  }

  return {
    redirect: {
      destination: `/`,
      permanent: false,
    },
  }
}

const Welcome: React.FC<
  React.PropsWithChildren<{
    purchase: {
      merchantChargeId: string | null
      bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
      product: {id: string; name: string}
    }
    existingPurchase: {
      id: string
      product: {id: string; name: string}
    }
    token: any
    availableUpgrades: {upgradableTo: {id: string; name: string}}[]
    upgrade: boolean
  }>
> = ({upgrade, purchase, token, existingPurchase, availableUpgrades}) => {
  const {data: session, status} = useSession()
  const [personalPurchase, setPersonalPurchase] = React.useState(
    purchase.bulkCoupon ? existingPurchase : purchase,
  )

  const redemptionsLeft =
    purchase.bulkCoupon &&
    purchase.bulkCoupon.maxUses > purchase.bulkCoupon.usedCount

  const hasCharge = Boolean(purchase.merchantChargeId)

  return (
    <Layout
      meta={{title: `Welcome to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
      footer={null}
    >
      <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center px-5 py-24 sm:py-32">
        <div className="flex w-full max-w-xl flex-col gap-3">
          <Header upgrade={upgrade} purchase={purchase} />
          <Share productName={purchase.product.name} />
          {redemptionsLeft && (
            <Invite>
              <InviteTeam
                setPersonalPurchase={setPersonalPurchase}
                session={session}
                purchase={purchase}
                existingPurchase={existingPurchase}
              />
            </Invite>
          )}
          {personalPurchase && <GetStarted />}
          {hasCharge && <InvoiceCard purchase={purchase} />}
        </div>
      </main>
    </Layout>
  )
}

const Header: React.FC<
  React.PropsWithChildren<{
    upgrade: boolean
    purchase: {
      merchantChargeId: string | null
      bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
      product: {id: string; name: string}
    }
  }>
> = ({upgrade, purchase}) => {
  return (
    <header className="flex flex-col items-center pb-8 text-center text-white">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
        {upgrade ? `You've Upgraded ` : `Welcome to `}
        {purchase.product.name}
      </h1>
      {/* <h2 className="pt-4 lg:text-2xl sm:text-xl text-lg font-medium max-w-sm font-heading text-orange-200">
      Thanks so much for purchasing{' '}
      {purchase.bulkCoupon
        ? `${purchase.product?.name} team license!`
        : `${purchase.product?.name} license!`}
    </h2> */}
    </header>
  )
}

const Invite: React.FC<React.PropsWithChildren<unknown>> = ({children}) => {
  return (
    <div className="rounded-lg border border-gray-800/80 bg-black/60 p-5">
      <h3 className="flex items-center gap-3 text-xl font-semibold">
        <UserGroupIcon className="w-5 text-cyan-500" /> Invite your team
      </h3>
      {children}
    </div>
  )
}

const GetStarted: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <div className="relative flex flex-col items-center p-8 text-center">
      <MuxPlayer playbackId="MP73OYRQ01024QL600kKBwdASaMc49me8008U4Il8og0202xE" />
      <h2 className="flex items-center gap-1 pt-12 pb-8 text-2xl font-semibold text-white sm:text-3xl">
        <span>Ready to get started?</span>
      </h2>
      <Link href={`/workshops`}>
        <a className="group flex-shrink-0 rounded-md bg-cyan-300 py-4 pl-5 pr-8 text-lg font-semibold text-gray-900 shadow-xl transition-all focus-visible:ring-white hover:bg-cyan-200">
          <span className="pr-2.5">
            Start {process.env.NEXT_PUBLIC_SITE_TITLE}{' '}
          </span>
          <span
            role="presentation"
            aria-hidden="true"
            className="absolute text-cyan-800 transition group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </Link>
    </div>
  )
}

const Share: React.FC<React.PropsWithChildren<{productName: string}>> = ({
  productName,
}) => {
  const tweet = `https://twitter.com/intent/tweet/?text=Be a TypeScript Wizard with Total TypeScript by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER} 🧙 https%3A%2F%2Fwww.totaltypescript.com%2F`
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-8 pt-6 pb-3 text-center">
      <p className="gap-1 text-lg text-white">
        Tell your friends about {process.env.NEXT_PUBLIC_SITE_TITLE}, <br />
        it would help me to get a word out.{' '}
        <span role="img" aria-label="smiling face">
          😊
        </span>
      </p>
      <a
        href={tweet}
        rel="noopener noreferrer"
        target="_blank"
        className="flex items-center gap-2 rounded-md border border-gray-700 px-3 py-2 text-white transition hover:bg-white/5"
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
