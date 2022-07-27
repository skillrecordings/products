import * as React from 'react'
import {DocumentTextIcon, UserGroupIcon} from '@heroicons/react/outline'
import {serialize} from '../../utils/prisma-next-serializer'
import {useSession} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import InviteTeam from 'components/team'
import Layout from 'components/app/layout'
import Image from 'next/image'
import {prisma} from '@skillrecordings/database'
import Link from 'next/link'
import {stripeData} from '../../utils/record-new-purchase'
import {getPurchaseDetails} from '../../lib/purchases'
import {isString} from 'lodash'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../../utils/honeycomb-tracer'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
}) => {
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })
  const {purchaseId: purchaseQueryParam, session_id, upgrade} = query
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  let purchaseId = purchaseQueryParam

  if (session_id) {
    const {stripeChargeId} = await stripeData(session_id as string)
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
            purchase: serialize(purchase),
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

const Welcome: React.FC<{
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
}> = ({upgrade, purchase, token, existingPurchase, availableUpgrades}) => {
  const {data: session, status} = useSession()
  const [personalPurchase, setPersonalPurchase] = React.useState(
    purchase.bulkCoupon ? existingPurchase : purchase,
  )

  const redemptionsLeft =
    purchase.bulkCoupon &&
    purchase.bulkCoupon.maxUses > purchase.bulkCoupon.usedCount

  return (
    <Layout
      meta={{title: 'Welcome to Testing Accessibility'}}
      footer={null}
      className="bg-green-700 bg-noise"
    >
      <main className="flex flex-col flex-grow items-center justify-center sm:py-16 py-8 mx-auto w-full px-5">
        <div className=" max-w-lg w-full gap-3 flex flex-col">
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

const Header: React.FC<{upgrade: boolean}> = ({upgrade}) => {
  return (
    <header className="text-white text-center pb-8 flex flex-col items-center">
      <Image
        src={require('../../../public/assets/lighthouse@2x.png')}
        width={200}
        height={200}
        alt="a shining lighthouse"
      />
      <h1 className="font-bold lg:text-5xl sm:text-4xl text-3xl font-heading">
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

const Invoice: React.FC<{purchase: any}> = ({purchase}: any) => {
  return (
    <div className="bg-white rounded-md sm:px-8 px-5 py-5 flex items-center justify-between">
      <h2 className="font-bold flex items-center gap-1 text-xl">
        <DocumentTextIcon
          aria-hidden="true"
          className="w-5 h-5 text-green-500"
        />
        <span>Invoice</span>
      </h2>
      <Link href={`/invoices/${purchase.merchantChargeId}`}>
        <a
          target="_blank"
          className="border bg-green-500 hover:bg-green-600 text-white transition px-4 py-2 rounded-md flex-shrink-0 font-semibold"
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

const Invite: React.FC = ({children}) => {
  return (
    <div className="sm:px-8 px-5 sm:py-8 py-5 bg-white rounded-lg">
      <h3 className="flex items-center gap-2 text-xl font-bold">
        <UserGroupIcon className="w-5 text-green-500" /> Invite your team
      </h3>
      {children}
    </div>
  )
}

const GetStarted: React.FC = () => {
  return (
    <div className="p-8 flex items-center text-center relative flex-col">
      <Image
        src={require('../../../public/assets/divider-trees@2x.png')}
        alt=""
        width={100 / 1.5}
        height={66 / 1.5}
        aria-hidden="true"
      />
      <h2 className="pt-12 font-semibold flex items-center gap-1 sm:text-3xl text-2xl pb-8 text-white">
        <span>Ready to get started?</span>
      </h2>
      <Link href={`/learn`}>
        <a className="text-green-900 text-lg bg-yellow-500 focus-visible:ring-white px-5 py-4 hover:-rotate-1 hover:scale-105 transition-all hover:bg-yellow-400 rounded-md flex-shrink-0 font-semibold">
          Start Testing Accessibility{' '}
          <span role="presentation" aria-hidden="true">
            →
          </span>
        </a>
      </Link>
    </div>
  )
}

const Share: React.FC = () => {
  const tweet = `https://twitter.com/intent/tweet/?text=Just purchased TestingAccessibility.com by @MarcySutton`
  return (
    <div className="px-8 pt-12 pb-5 flex flex-col items-center text-center max-w-lg mx-auto gap-5">
      <p className="text-white font-semibold text-lg gap-1">
        Please consider telling your friends about Testing Accessibility, it
        would help me to get a word out.{' '}
        <span role="img" aria-label="smiling face">
          😊
        </span>
      </p>
      <a
        href={tweet}
        rel="noopener noreferrer"
        target="_blank"
        className="text-white px-3 py-2 rounded-md border border-orange-200/40 hover:bg-white/5 transition flex items-center gap-2"
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
