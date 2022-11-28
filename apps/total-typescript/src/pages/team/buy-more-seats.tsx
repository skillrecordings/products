import React from 'react'
import Layout from 'components/app/layout'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {GetServerSideProps} from 'next'
import BuyMoreSeats from 'team/buy-more-seats'
import {TicketIcon} from '@heroicons/react/outline'
import {getCurrentAbility} from '@skillrecordings/ability'
import {getToken} from 'next-auth/jwt'
import {getSdk} from '@skillrecordings/database'
import Card from 'team/card'

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
      meta={{title: `Invite your team to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
      className="bg-noise text-gray-900"
    >
      <main className="mx-auto flex w-full max-w-xl flex-grow flex-col items-center justify-center gap-3 p-5 py-16">
        <Card
          title={{content: 'Get more seats', as: 'h2'}}
          icon={<TicketIcon className="w-5 text-cyan-500" aria-hidden="true" />}
        >
          <BuyMoreSeats productId={purchase.product.id} userId={userId} />
        </Card>
      </main>
    </Layout>
  )
}

export default BuyMoreSeatsPage
