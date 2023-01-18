import * as React from 'react'
import {DocumentTextIcon, UserGroupIcon} from '@heroicons/react/outline'
import {
  convertToSerializeForNextResponse,
  stripeData,
} from '@skillrecordings/commerce-server'
import {useSession} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import Layout from 'components/layout'
import {getSdk, prisma} from '@skillrecordings/database'
import Link from 'next/link'
import {first, isString} from 'lodash'
import InviteTeam from 'team'
import {InvoiceCard} from 'pages/invoices'
import MuxPlayer from '@mux/mux-player-react'
import {getAllWorkshops} from 'lib/workshops'
import {SanityDocument} from '@sanity/client'
import Image from 'next/legacy/image'

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

    if (purchase) {
      // TODO: replace with getActiveProduct
      const workshops = await getAllWorkshops()
      const workshop = first(
        workshops.filter(
          (workshop: SanityDocument) =>
            workshop?.product?.productId === purchase.product.id,
        ),
      )

      return {
        props: {
          workshop,
          purchase: convertToSerializeForNextResponse(purchase),
          existingPurchase,
          availableUpgrades,
          upgrade: upgrade === 'true',
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
    workshop?: SanityDocument
  }>
> = ({
  upgrade,
  purchase,
  token,
  existingPurchase,
  availableUpgrades,
  workshop,
}) => {
  const {data: session, status} = useSession()
  const [personalPurchase, setPersonalPurchase] = React.useState<
    PersonalPurchase | Purchase
  >(purchase.bulkCoupon ? existingPurchase : purchase)

  const redemptionsLeft =
    purchase.bulkCoupon &&
    purchase.bulkCoupon.maxUses > purchase.bulkCoupon.usedCount

  const hasCharge = Boolean(purchase.merchantChargeId)

  return (
    <Layout
      meta={{title: `Welcome to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
      footer={null}
    >
      <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center px-5 pt-10 pb-32">
        <div className="flex w-full max-w-screen-md flex-col gap-3">
          <Header
            workshop={workshop}
            upgrade={upgrade}
            purchase={purchase}
            personalPurchase={personalPurchase}
          />
          <div className="flex flex-col gap-10">
            {redemptionsLeft && (
              <div>
                <h2 className="pb-2 font-heading text-sm font-black uppercase">
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
                <h2 className="pb-2 font-heading text-sm font-black uppercase">
                  Get your invoice
                </h2>
                <InvoiceCard purchase={purchase} />
              </div>
            )}
            <div>
              <h2 className="pb-2 font-heading text-sm font-black uppercase">
                Share Pro Tailwind
              </h2>
              <Share productName={purchase.product.name} />
            </div>
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
    workshop?: SanityDocument
  }>
> = ({upgrade, purchase, workshop, personalPurchase}) => {
  return (
    <header>
      <div className="flex flex-col items-center gap-10 pb-8 sm:flex-row">
        {workshop?.image && (
          <div className="flex flex-shrink-0 items-center justify-center">
            <Image
              src={workshop.image}
              alt={workshop.title}
              width={250}
              height={250}
            />
          </div>
        )}
        <div className="flex flex-col items-start">
          <h1 className="font-heading text-3xl font-black sm:text-3xl lg:text-4xl">
            <span className="block pb-4 font-heading text-sm font-black uppercase text-brand-red">
              {upgrade ? `You've Upgraded ` : `Welcome to `}
            </span>
            {purchase.product.name}
          </h1>
          {personalPurchase && (
            <Link
              href={`/workshops/${workshop?.slug.current}`}
              className="mt-8 rounded-full bg-brand-red px-8 py-3 font-heading text-lg font-bold text-white shadow-xl shadow-black/10 transition hover:brightness-110"
            >
              Start Learning
            </Link>
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
  const tweet = `https://twitter.com/intent/tweet/?text=Pro Tailwind by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER} 🧙 https%3A%2F%2Fwww.protailwind.com%2F`
  return (
    <div className="flex flex-col justify-between gap-5 rounded-lg border border-gray-100 bg-white px-5 py-6 shadow-xl shadow-gray-400/5 sm:flex-row sm:items-center">
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
        className="flex items-center gap-2 self-start rounded-full border border-sky-500 px-5 py-2.5 font-heading font-semibold text-sky-500 transition hover:bg-sky-500 hover:text-white"
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
