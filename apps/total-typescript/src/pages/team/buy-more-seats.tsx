import React from 'react'
import Layout from 'components/app/layout'
import {GetServerSideProps} from 'next'
import BuyMoreSeats from 'team/buy-more-seats'
import {TicketIcon} from '@heroicons/react/outline'
import {getToken} from 'next-auth/jwt'
import {getSdk} from '@skillrecordings/database'
import Card from 'team/card'
import {z} from 'zod'

const productDataSchema = z.object({id: z.string(), name: z.string()})

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({req})
  const {getPurchasesForUser, getProduct} = getSdk()

  let productId: string | undefined = undefined

  if (query.productId) {
    productId = query.productId as string
  } else {
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

    productId = existingPurchase.productId
  }

  const product = await getProduct({where: {id: productId}})

  if (token?.sub && Boolean(product)) {
    const productData = productDataSchema.parse(product)

    return {
      props: {
        product: productData,
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
  product: z.infer<typeof productDataSchema>
  userId: string
}

const BuyMoreSeatsPage: React.FC<
  React.PropsWithChildren<BuyMoreSeatsPageProps>
> = ({product, userId}) => {
  return (
    <Layout
      meta={{
        title: `Invite your team to ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
      }}
      className="bg-noise text-gray-900"
    >
      <main className="mx-auto flex w-full max-w-xl flex-grow flex-col items-center justify-center gap-3 p-5 py-16">
        <h2 className="mx-auto max-w-lg py-5 font-text text-3xl font-bold text-white lg:text-4xl">
          {product.name}
        </h2>
        <Card
          title={{content: 'Get more seats', as: 'h2'}}
          icon={<TicketIcon className="w-5 text-cyan-500" aria-hidden="true" />}
        >
          <BuyMoreSeats productId={product.id} userId={userId} />
        </Card>
      </main>
    </Layout>
  )
}

export default BuyMoreSeatsPage
