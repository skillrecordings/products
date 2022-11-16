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

  return (
    <Layout
      meta={{title: `Welcome to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
      footer={null}
      className="bg-noise"
    >
      <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center py-8 px-5 sm:py-16">
        <div className=" flex w-full max-w-lg flex-col gap-3">
          <Header upgrade={upgrade} />
          {purchase.merchantChargeId && <Invoice purchase={purchase} />}
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
          <Share />
        </div>
      </main>
    </Layout>
  )
}

const Header: React.FC<React.PropsWithChildren<{upgrade: boolean}>> = ({
  upgrade,
}) => {
  return (
    <header className="flex flex-col items-center pb-8 text-center text-white">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
        {upgrade ? `You've Upgraded ` : `Welcome to `}
        {process.env.NEXT_PUBLIC_SITE_TITLE}
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

const Invoice: React.FC<React.PropsWithChildren<{purchase: any}>> = ({
  purchase,
}: any) => {
  return (
    <div className="flex items-center justify-between rounded-md bg-white px-5 py-5 sm:px-8">
      <h2 className="flex items-center gap-1 text-xl font-bold text-cyan-900">
        <DocumentTextIcon
          aria-hidden="true"
          className="h-5 w-5 text-cyan-500"
        />
        <span>Invoice</span>
      </h2>
      <Link href={`/invoices/${purchase.merchantChargeId}`}>
        <a
          target="_blank"
          className="flex-shrink-0 rounded-md border bg-cyan-500 px-4 py-2 font-semibold text-white transition hover:bg-cyan-600"
          title="Link opens in a new window"
        >
          Get your invoice{' '}
          <span role="presentation" aria-hidden="true">
            →
          </span>
        </a>
      </Link>
    </div>
  )
}

const Invite: React.FC<React.PropsWithChildren<unknown>> = ({children}) => {
  return (
    <div className="rounded-lg bg-white px-5 py-5 sm:px-8 sm:py-8">
      <h3 className="flex items-center gap-2 text-xl font-bold">
        <UserGroupIcon className="w-5 text-green-500" /> Invite your team
      </h3>
      {children}
    </div>
  )
}

const GetStarted: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <div className="relative flex flex-col items-center p-8 text-center">
      <h2 className="flex items-center gap-1 pt-12 pb-8 text-2xl font-semibold text-white sm:text-3xl">
        <span>Ready to get started?</span>
      </h2>
      <Link href={`/workshops`}>
        <a className="flex-shrink-0 rounded-md bg-cyan-500 px-5 py-4 text-lg font-semibold text-gray-900 transition-all focus-visible:ring-white hover:-rotate-1 hover:scale-105 hover:bg-yellow-400">
          Start {process.env.NEXT_PUBLIC_SITE_TITLE}{' '}
          <span role="presentation" aria-hidden="true">
            →
          </span>
        </a>
      </Link>
    </div>
  )
}

const Share: React.FC<React.PropsWithChildren<unknown>> = () => {
  const tweet = `https://twitter.com/intent/tweet/?text=Just purchased Engineering Management for the Rest of Us by @sarah_edo`
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-8 pt-12 pb-5 text-center">
      <p className="gap-1 text-lg font-semibold text-white">
        Please consider telling your friends about{' '}
        {process.env.NEXT_PUBLIC_SITE_TITLE}, it would help me to get a word
        out.{' '}
        <span role="img" aria-label="smiling face">
          😊
        </span>
      </p>
      <a
        href={tweet}
        rel="noopener noreferrer"
        target="_blank"
        className="flex items-center gap-2 rounded-md border border-orange-200/40 px-3 py-2 text-white transition hover:bg-white/5"
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
