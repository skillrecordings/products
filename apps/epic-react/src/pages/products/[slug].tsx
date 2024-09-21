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
import {getAllActiveProducts, getProductBySlug} from '@/lib/products'
import ProductTemplate from '@/templates/product-template'
import PurchasedProductTemplate from '@/templates/purchased-product-template'
import {getSdk} from '@skillrecordings/database'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {couponForPurchases, eRv1PurchasedOnDate} from '@/lib/purchases'
import {sanityClientNoCdn} from '@/utils/sanity-client'
import groq from 'groq'
import {getUserAndSubscriber} from '@/lib/users'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, res, query, params} = context
  const {getPurchaseDetails} = getSdk()
  const {user, subscriber} = await getUserAndSubscriber({req, res, query})
  const pricingActive = await sanityClientNoCdn.fetch(
    groq`*[_type == 'pricing' && active == true][0]`,
  )
  const token = await getToken({req})
  const product = await getProductBySlug(params?.slug as string)

  if (!product) {
    return {
      notFound: true,
    }
  }

  const erV1PurchasedOnDate = eRv1PurchasedOnDate(user?.purchases)
  const coupon =
    (await couponForPurchases(erV1PurchasedOnDate)) || query?.coupon

  const allowPurchase =
    pricingActive ||
    query?.allowPurchase === 'true' ||
    query?.coupon ||
    query?.code

  const products = await getAllActiveProducts(!allowPurchase)

  const {props: commerceProps} = await propsForCommerce({
    query: {
      ...query,
      coupon,
    },
    token,
    products,
  })

  if (!token?.sub) {
    // return {props: {...commerceProps.props, product}}
    return {
      redirect: {
        destination: `/buy`,
        permanent: false,
      },
    }
  }

  const purchaseForProduct = commerceProps.purchases?.find(
    (purchase: Purchase) => {
      return purchase.productId === product.productId
    },
  )

  if (!purchaseForProduct) {
    return {props: {...commerceProps, product}}
  }

  const {purchase, existingPurchase} = await getPurchaseDetails(
    purchaseForProduct.id,
    token.sub,
  )

  if (!purchase) {
    return {
      redirect: {
        destination: `/buy`,
        permanent: false,
      },
    }
  }
  const productLabels = coupon
    ? {
        'kcd_product-clzlrf0g5000008jm0czdanmz': 'Exclusive Upgrade Discount',
      }
    : {}
  return {
    props: {
      ...commerceProps,
      hasPurchasedCurrentProduct: Boolean(purchase),
      existingPurchase: convertToSerializeForNextResponse(existingPurchase),
      product,
      productLabels,
    },
  }
}

export type Purchase = {
  id: string
  status: 'Valid' | 'Refunded' | 'Disputed' | 'Pending' | 'Restricted'
  merchantChargeId: string | null
  bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
  product: {id: string; name: string; status: number}
  productId: string
  userId: string
  createdAt: string
  totalAmount: number
}

export type ProductPageProps = {
  userId: string
  product: SanityProduct
  existingPurchase: {
    id: string
    product: {id: string; name: string}
  }
  purchases: Purchase[]
  hasPurchasedCurrentProduct: boolean
  mdx?: MDXRemoteSerializeResult
  availableBonuses?: any[]
} & CommerceProps

const ProductPage: React.FC<ProductPageProps> = (props) => {
  const {hasPurchasedCurrentProduct} = props

  return (
    <>
      {hasPurchasedCurrentProduct ? (
        <PriceCheckProvider purchasedProductIds={[props.product.productId]}>
          <PurchasedProductTemplate {...props} />
        </PriceCheckProvider>
      ) : (
        <PriceCheckProvider
          purchasedProductIds={[
            ...(props.purchases
              ? props.purchases.map((purchase) => purchase.productId)
              : []),
          ]}
        >
          <ProductTemplate {...props} />
        </PriceCheckProvider>
      )}
    </>
  )
}

export default ProductPage
