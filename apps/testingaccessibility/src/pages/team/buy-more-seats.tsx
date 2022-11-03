import React from 'react'
import Layout from 'components/app/layout'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {GetServerSideProps} from 'next'
import BuyMoreSeats from 'components/team/buy-more-seats'
import {TicketIcon} from '@heroicons/react/outline'
import {getCurrentAbility} from '@skillrecordings/ability'
import {getToken} from 'next-auth/jwt'
import {getSdk} from '@skillrecordings/database'
import Card from 'components/team/card'

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const token = await getToken({req})
  const ability = getCurrentAbility(token as any)
  const {getPurchasesForUser} = getSdk()

  const purchases = await getPurchasesForUser(token?.sub)

  // try to find a bulk purchase first
  const bulkPurchases = purchases.filter(
    (purchase) => purchase.bulkCoupon !== null,
  )

  // try to find individual-access purchase
  const individualPurchase = purchases.find(
    (purchase) =>
      purchase.bulkCoupon === null && purchase.redeemedBulkCouponId === null,
  )

  const existingPurchase = bulkPurchases[0] || individualPurchase

  if (token?.sub && existingPurchase) {
    return {
      props: {
        purchase: convertToSerializeForNextResponse(existingPurchase),
        userId: token.sub,
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

type BuyMoreSeatsPageProps = {
  purchase: {
    merchantChargeId: string | null
    bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
    product: {id: string; name: string}
  }
  userId: string
}

const BuyMoreSeatsPage: React.FC<
  React.PropsWithChildren<BuyMoreSeatsPageProps>
> = ({purchase, userId}) => {
  return (
    <Layout
      meta={{title: 'Invite your team to Testing Accessibility'}}
      className="bg-green-700 bg-noise"
    >
      <main className="flex flex-col flex-grow items-center justify-center py-16 mx-auto w-full p-5 max-w-xl gap-3">
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

export default BuyMoreSeatsPage
