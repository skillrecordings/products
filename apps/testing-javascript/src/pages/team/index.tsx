import React from 'react'
import Layout from 'components/layout'
import {find, get, isNull, isString} from 'lodash'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {type GetServerSideProps} from 'next'
import {getPurchasedProduct} from '@skillrecordings/skill-lesson/team/get-purchased-product'
import BuyMoreSeats from '@skillrecordings/skill-lesson/team/buy-more-seats'
import {UserGroupIcon, TicketIcon, UserIcon} from '@heroicons/react/outline'
import {useSession} from 'next-auth/react'
import {getCurrentAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {getToken} from 'next-auth/jwt'
import {getSdk} from '@skillrecordings/database'
import Card from '@skillrecordings/skill-lesson/team/card'
import InviteTeam from '@skillrecordings/skill-lesson/team'
import {ClaimedTeamSeats} from '@skillrecordings/skill-lesson/team/claimed-team-seats'
import {ChevronRightIcon, DocumentTextIcon} from '@heroicons/react/solid'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const token = await getToken({req})
  const ability = getCurrentAbility({user: token as any})
  const {getPurchaseDetails} = getSdk()

  if (ability.can('view', 'Team')) {
    const {purchases} = await getPurchasedProduct(req)
    const purchaseId = get(
      find(purchases, (purchase: any) => !isNull(purchase.bulkCoupon)),
      'id',
    )

    if (token && isString(purchaseId) && isString(token?.sub)) {
      const {purchase, existingPurchase, availableUpgrades} =
        await getPurchaseDetails(purchaseId, token.sub)
      return purchase
        ? {
            props: {
              purchase: convertToSerializeForNextResponse(purchase),
              existingPurchase,
              availableUpgrades,
              userId: token.sub,
            },
          }
        : {
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

type TeamPageProps = {
  purchase: {
    merchantChargeId: string | null
    bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
    product: {id: string; name: string}
    totalAmount: number
  }
  existingPurchase: {
    id: string
    product: {id: string; name: string}
  }
  availableUpgrades: {upgradableTo: {id: string; name: string}}[]
  userId: string
}

const TeamPage: React.FC<React.PropsWithChildren<TeamPageProps>> = ({
  purchase,
  existingPurchase,
  availableUpgrades,
  userId,
}) => {
  const {data: session} = useSession()
  const [personalPurchase, setPersonalPurchase] = React.useState<any>(
    purchase.bulkCoupon ? existingPurchase : purchase,
  )

  return (
    <Layout meta={{title: 'Invite your team to Testing JavaScript'}}>
      <main
        data-team-page=""
        className="mx-auto flex w-full max-w-3xl flex-grow flex-col items-center justify-start gap-3 p-5 pb-16 pt-16 text-gray-900"
      >
        <h2 className="px-5 text-center font-heading text-5xl font-bold sm:text-5xl mb-8">
          Team
        </h2>
        <Card
          title={{as: 'h1', content: 'Invite your team'}}
          icon={
            <UserGroupIcon className="w-5 text-cyan-500" aria-hidden="true" />
          }
        >
          <InviteTeam
            session={session}
            purchase={purchase}
            existingPurchase={existingPurchase}
            setPersonalPurchase={setPersonalPurchase}
          />
        </Card>
        <Card
          title={{content: 'Get more seats', as: 'h2'}}
          icon={<TicketIcon className="w-5 text-cyan-500" aria-hidden="true" />}
        >
          <BuyMoreSeats productId={purchase.product.id} userId={userId} />
        </Card>
        {purchase && (
          <div data-team-card="">
            <div>
              <div className="flex w-full gap-2 pb-4">
                <div>
                  <DocumentTextIcon aria-hidden className="w-6 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-tight">
                    Invoices
                  </h2>
                </div>
              </div>
              <Link
                data-view-invoices-button=""
                href={`/invoices`}
                className="flex flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-lg font-semibold text-white transition hover:bg-indigo-700 sm:ml-0 sm:mt-0 sm:justify-center"
              >
                <span className="pr-0.5">View Invoices</span>
                <ChevronRightIcon aria-hidden="true" className="w-4" />
              </Link>
            </div>
          </div>
        )}
        <Card
          title={{content: 'Claimed seats', as: 'h2'}}
          icon={<UserIcon className="w-5 text-cyan-500" aria-hidden="true" />}
        >
          <ClaimedTeamSeats
            session={session}
            purchase={purchase}
            existingPurchase={existingPurchase}
            setPersonalPurchase={setPersonalPurchase}
          />
        </Card>
      </main>
    </Layout>
  )
}

export default TeamPage
