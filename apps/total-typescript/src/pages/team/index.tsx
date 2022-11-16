import React from 'react'
import Layout from 'components/app/layout'
import {find, get, isNull, isString} from 'lodash'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {GetServerSideProps} from 'next'
import {getPurchasedProduct} from 'team/get-purchased-product'
import BuyMoreSeats from 'team/buy-more-seats'
import {UserGroupIcon, TicketIcon} from '@heroicons/react/outline'
import {useSession} from 'next-auth/react'
import {getCurrentAbility} from 'ability/ability'
import {getToken} from 'next-auth/jwt'
import {getSdk} from '@skillrecordings/database'
import Card from 'team/card'
import InviteTeam from 'team'

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const token = await getToken({req})
  const ability = getCurrentAbility(token as any)
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
    <Layout
      meta={{title: 'Invite your team to Testing Accessibility'}}
      className="bg-noise bg-green-700"
    >
      <main className="mx-auto flex w-full max-w-xl flex-grow flex-col items-center justify-center gap-3 p-5 py-16">
        <Card
          title={{as: 'h1', content: 'Invite your team'}}
          icon={
            <UserGroupIcon className="w-5 text-green-500" aria-hidden="true" />
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
          icon={
            <TicketIcon className="w-5 text-green-500" aria-hidden="true" />
          }
        >
          <BuyMoreSeats productId={purchase.product.id} userId={userId} />
        </Card>
      </main>
    </Layout>
  )
}

export default TeamPage
