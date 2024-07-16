import React from 'react'
import Layout from '@/components/app/layout'
import {find, get, isNull, isString} from 'lodash'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {GetServerSideProps} from 'next'
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
    product: {id: string; name: string; status: number}
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
    <Layout meta={{title: 'Invite your team to Epic React'}}>
      <main
        data-team-page=""
        className="mx-auto flex w-full max-w-screen-md grow flex-col justify-center gap-y-16 px-5 py-16 lg:py-20"
      >
        <Card
          title={{as: 'h1', content: 'Invite your team'}}
          icon={
            <UserGroupIcon className="w-6 text-cyan-500" aria-hidden="true" />
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
          icon={<TicketIcon className="w-6 text-cyan-500" aria-hidden="true" />}
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
                  <h2 className="text-lg font-semibold leading-tight sm:text-xl">
                    Invoices
                  </h2>
                </div>
              </div>
              <Link
                href={`/invoices`}
                className="flex items-center justify-center rounded-md bg-er-gray-200 px-4 py-2.5 text-base font-semibold leading-6 transition-colors duration-100 ease-in-out hover:bg-er-gray-300 dark:bg-er-gray-300 dark:hover:bg-er-gray-400"
              >
                <span className="pr-0.5">View Invoices</span>
                <ChevronRightIcon aria-hidden="true" className="w-4" />
              </Link>
            </div>
          </div>
        )}
        <Card
          title={{content: 'Claimed seats', as: 'h2'}}
          icon={<UserIcon className="w-6 text-cyan-500" aria-hidden="true" />}
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
