import React from 'react'
import {GetServerSideProps} from 'next'
import type {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {
  convertToSerializeForNextResponse,
  propsForCommerce,
} from '@skillrecordings/commerce-server'
import {getToken} from 'next-auth/jwt'
import {getProductBySlug} from '@skillrecordings/skill-lesson/path-to-purchase/products.server'
import ProductTemplate from 'templates/product-template'
import PurchasedProductTemplate from 'templates/purchased-product-template'
import {getSdk} from '@skillrecordings/database'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query, params} = context
  const {getPurchaseDetails} = getSdk()

  const token = await getToken({req})
  const product = await getProductBySlug(params?.slug as string)

  if (!product) {
    return {
      notFound: true,
    }
  }

  const commerceProps = await propsForCommerce({
    query,
    token,
    products: [product],
  })

  if (!token?.sub) {
    return commerceProps
  }

  const purchaseForProduct = commerceProps.props.purchases?.find(
    (purchase: Purchase) => {
      return purchase.productId === product.productId
    },
  )

  if (!purchaseForProduct) {
    return commerceProps
  }

  const {purchase, existingPurchase} = await getPurchaseDetails(
    purchaseForProduct.id,
    token.sub,
  )

  return {
    props: {
      ...commerceProps.props,
      hasPurchasedCurrentProduct: Boolean(purchase),
      existingPurchase: convertToSerializeForNextResponse(existingPurchase),
      product,
    },
  }
}

export type Purchase = {
  id: string
  status: 'Valid' | 'Refunded' | 'Disputed' | 'Pending' | 'Restricted'
  merchantChargeId: string | null
  bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
  product: {id: string; name: string}
  productId: string
  userId: string
  createdAt: string
  totalAmount: number
}

export type ProductPageProps = {
  userId: string
  product: SanityProduct
  existingPurchase: {id: string; product: {id: string; name: string}}
  purchases: Purchase[]
  hasPurchasedCurrentProduct: boolean
} & CommerceProps

const ProductPage: React.FC<ProductPageProps> = (props) => {
  const {hasPurchasedCurrentProduct} = props

  return (
    <>
      {hasPurchasedCurrentProduct ? (
        <PurchasedProductTemplate {...props} />
      ) : (
        <ProductTemplate {...props} />
      )}
    </>
  )
}

export default ProductPage
