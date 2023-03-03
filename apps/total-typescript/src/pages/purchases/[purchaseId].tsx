import React from 'react'
import {GetServerSideProps} from 'next'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import PurchaseDetailsTemplate, {
  type PurchaseDetailsProps,
} from 'purchase-details/purchase-details-template'
import {getActiveProducts} from 'path-to-purchase-react/products.server'
import {getSdk} from '@skillrecordings/database'
import {getToken} from 'next-auth/jwt'
import isString from 'lodash/isString'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
}) => {
  const sessionToken = await getToken({req})
  const {purchaseId, welcome} = query

  const {getProduct, getPurchase, getUserById, getPurchaseDetails} = getSdk()

  if (purchaseId && sessionToken && isString(sessionToken?.sub)) {
    const purchase = await getPurchase({
      where: {
        id: purchaseId as string,
      },
      select: {
        id: true,
        status: true,
        productId: true,
        totalAmount: true,
        createdAt: true,
        merchantChargeId: true,
        userId: true,
        product: true,
        bulkCoupon: true,
      },
    })
    if (purchase) {
      const product = await getProduct({
        where: {id: purchase?.productId},
        select: {
          id: true,
          name: true,
        },
      })

      const user = await getUserById({
        where: {id: purchase.userId as string},
        select: {
          email: true,
        },
      })

      const {existingPurchase} = await getPurchaseDetails(
        purchase.id,
        sessionToken.sub,
      )

      const sanityProduct = await getActiveProducts().then(
        // product is pricing document in sanity
        (data) => data.products[0],
      )
      console.log({sanityProduct})

      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {
          purchase: convertToSerializeForNextResponse(purchase),
          product: convertToSerializeForNextResponse(product),
          existingPurchase,
          user,
          sanityProduct,
          welcome: Boolean(isString(welcome)),
        },
      }
    }
  }

  return {
    redirect: {
      destination: '/purchases',
      permanent: false,
    },
  }
}

const PurchaseDetail: React.FC<PurchaseDetailsProps> = ({
  welcome,
  product,
  user,
  purchase,
  sanityProduct,
  existingPurchase,
}) => {
  return (
    <PurchaseDetailsTemplate
      welcome={welcome}
      product={product}
      user={user}
      purchase={purchase}
      sanityProduct={sanityProduct}
      existingPurchase={existingPurchase}
    />
  )
}

export default PurchaseDetail
