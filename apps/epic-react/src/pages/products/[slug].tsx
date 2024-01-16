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
import PurchasedProductTemplate from '@/templates/purchased-product-template'
import {getSdk} from '@skillrecordings/database'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {getWorkshop} from '@/lib/workshops'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import ProductTemplate from '@/templates/product-template'
import {getAvailableBonuses} from '@/lib/available-bonuses'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query, params} = context
  const {getPurchaseDetails} = getSdk()
  const availableBonuses = await getAvailableBonuses()
  const token = await getToken({req})
  const product = await getProductBySlug(params?.slug as string)
  const workshop = await getWorkshop(params?.slug as string)
  const mdx = product.body && (await serializeMDX(product.body))

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
    return {
      props: {...commerceProps.props, workshop, product, mdx, availableBonuses},
    }
  }

  const purchaseForProduct = commerceProps.props.purchases?.find(
    (purchase: Purchase) => {
      return purchase.productId === product.productId
    },
  )

  if (!purchaseForProduct) {
    return {
      props: {...commerceProps.props, workshop, product, mdx, availableBonuses},
    }
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
      workshop,
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
  workshop?: Module
  mdx?: MDXRemoteSerializeResult
  availableBonuses?: any[]
} & CommerceProps

const ProductPage: React.FC<ProductPageProps> = (props) => {
  const {workshop, hasPurchasedCurrentProduct} = props

  return (
    <>
      {hasPurchasedCurrentProduct ? (
        <PriceCheckProvider purchasedProductIds={[props.product.productId]}>
          <PurchasedProductTemplate {...props} />
        </PriceCheckProvider>
      ) : (
        <ProductTemplate
          mdx={props.mdx as MDXRemoteSerializeResult}
          {...props}
        />
      )}
    </>
  )
}

export default ProductPage
