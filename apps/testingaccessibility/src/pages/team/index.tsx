import React from 'react'
import Layout from 'components/app/layout'
import {find, get, isNull, isString} from 'lodash'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {GetServerSideProps} from 'next'
import {getPurchasedProduct} from 'lib/get-purchased-product'
import InviteTeam from 'components/team'
import BuyMoreSeats from 'components/team/buy-more-seats'
import {UserGroupIcon, TicketIcon} from '@heroicons/react/outline'
import {useSession} from 'next-auth/react'
import {getCurrentAbility} from '@skillrecordings/ability'
import {getToken} from 'next-auth/jwt'
import {getSdk} from '@skillrecordings/database'
import Card from 'components/team/card'

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const token = await getToken({req})
  const ability = getCurrentAbility(token as any)
  const {getPurchaseDetails} = getSdk()

  if (ability.can('view', 'Team')) {
    // TODO: This could just be a call to getSDK's getPurchasesForUser(token.id)
    const {purchases} = await getPurchasedProduct(req)
    const purchaseId = get(
      find(
        purchases,
        (purchase: {bulkCoupon: object | null}) => !isNull(purchase.bulkCoupon),
      ),
      'id',
    )

    if (token && isString(purchaseId) && isString(token?.sub)) {
      // the `existingIndividualPurchase` is a non-bulk purchase, so did this
      // person already purchase individual access to the product?
      const {purchase, existingIndividualPurchase, availableUpgrades} =
        await getPurchaseDetails(purchaseId, token.sub)
      return purchase
        ? {
            props: {
              purchase: convertToSerializeForNextResponse(purchase),
              existingIndividualPurchase,
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
  existingIndividualPurchase: {
    id: string
    product: {id: string; name: string}
  }
  availableUpgrades: {upgradableTo: {id: string; name: string}}[]
  userId: string
}

const TeamPage: React.FC<React.PropsWithChildren<TeamPageProps>> = ({
  purchase,
  existingIndividualPurchase,
  userId,
}) => {
  const {data: session} = useSession()
  const existingPersonalPurchase = !!(purchase.bulkCoupon
    ? existingIndividualPurchase
    : purchase)

  return (
    <Layout
      meta={{title: 'Invite your team to Testing Accessibility'}}
      className="bg-green-700 bg-noise"
    >
      <main className="flex flex-col flex-grow items-center justify-center py-16 mx-auto w-full p-5 max-w-xl gap-3">
        <Card
          title={{as: 'h1', content: 'Invite your team'}}
          icon={
            <UserGroupIcon className="w-5 text-green-500" aria-hidden="true" />
          }
        >
          <InviteTeam
            userEmail={session?.user?.email}
            purchase={purchase}
            existingPurchaseForSelf={existingPersonalPurchase}
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
