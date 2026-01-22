import {Event, getAllEvents, getEvent} from 'lib/events'
import React from 'react'
import {GetServerSideProps, GetStaticPaths, GetStaticProps} from 'next'
import EventTemplate from 'templates/event-template'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {getSdk, prisma} from '@skillrecordings/database'
import {getAvailableBonuses} from 'lib/available-bonuses'
import {getToken} from 'next-auth/jwt'
import {getProductBySlug} from '@skillrecordings/skill-lesson/path-to-purchase/products.server'
import {getWorkshop} from 'lib/workshops'
import {
  convertToSerializeForNextResponse,
  propsForCommerce,
} from '@skillrecordings/commerce-server'
import {Purchase} from 'pages/products/[slug]'
import type {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {Product} from 'lib/products'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import PurchasedProductTemplate from 'templates/purchased-product-template'
import ProductTemplate from 'templates/product-template'
import PurchasedEventTemplate from 'templates/purchased-event-template'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query, params} = context
  const {getPurchaseDetails} = getSdk()
  const availableBonuses = await getAvailableBonuses()
  const token = await getToken({req})
  const event = await getEvent(params?.event as string)

  if (!event) {
    return {
      notFound: true,
    }
  }

  const individualProduct = event.products?.find((p) => !p.isBundle)
  const bundleProductFromEvent = event.products?.find((p) => p.isBundle)

  const fallbackProduct = event.product

  // If there's only a bundle product (no individual), include it
  // Otherwise, only load individual products
  const productsToLoad = event.products
    ? event.products.filter((p) => {
        // Include bundle only if there's no individual product
        if (p.isBundle && !individualProduct) {
          return true
        }
        // Otherwise, only include individual products
        return !p.isBundle
      })
    : event.product
    ? [event.product]
    : []

  const allProductsRaw = await Promise.all(
    productsToLoad.map(async (p) => {
      const product = await getProductBySlug(p.slug)
      if (!product) return null

      const purchaseCount = await prisma.purchase.count({
        where: {
          productId: product.productId,
          status: {
            in: ['VALID', 'RESTRICTED'],
          },
        },
      })

      const productWithQuantityAvailable = await prisma.product.findUnique({
        where: {
          id: product.productId,
        },
        select: {
          quantityAvailable: true,
        },
      })

      let quantityAvailable = -1
      if (productWithQuantityAvailable) {
        quantityAvailable =
          productWithQuantityAvailable.quantityAvailable - purchaseCount
      }
      if (quantityAvailable < 0) {
        quantityAvailable = -1
      }

      return {
        product,
        quantityAvailable,
        totalQuantity: productWithQuantityAvailable?.quantityAvailable || -1,
        purchaseCount,
        isBundle: ('isBundle' in p && p.isBundle) || false,
      }
    }),
  )

  const allProducts = allProductsRaw.filter(
    (p): p is NonNullable<typeof p> => p !== null,
  )

  // If we only have a bundle product, use it; otherwise prefer individual
  const selectedProduct =
    individualProduct || bundleProductFromEvent || fallbackProduct
  const product =
    selectedProduct && (await getProductBySlug(selectedProduct?.slug as string))
  const mdx = event.body && (await serializeMDX(event.body))

  const selectedProductData = allProducts.find(
    (p) => p?.product.productId === product?.productId,
  )

  if (!product || !selectedProductData) {
    return {
      props: {
        event,
        mdx,
        availableBonuses,
        quantityAvailable: -1,
        totalQuantity: -1,
        product: null,
        purchaseCount: 0,
        allProducts: [],
      },
    }
  }

  const allProductIds = allProducts
    .map((p) => p?.product.productId)
    .filter(Boolean)
  const commerceProps = await propsForCommerce({
    query,
    token,
    products: allProducts
      .map((p) => p?.product)
      .filter((p): p is SanityProduct => Boolean(p)),
  })

  const bundleProductRaw = bundleProductFromEvent
    ? await getProductBySlug(bundleProductFromEvent.slug)
    : null

  const baseProps: Omit<
    EventPageProps,
    'hasPurchasedCurrentProduct' | 'existingPurchase'
  > = {
    ...commerceProps.props,
    event,
    mdx,
    availableBonuses,
    quantityAvailable: selectedProductData.quantityAvailable,
    totalQuantity: selectedProductData.totalQuantity,
    product,
    purchaseCount: selectedProductData.purchaseCount,
    ...(bundleProductRaw && {
      bundleProduct: bundleProductRaw as SanityProduct,
    }),
    allProducts: allProducts.map((p) => ({
      product: p.product,
      quantityAvailable: p.quantityAvailable,
      totalQuantity: p.totalQuantity,
      purchaseCount: p.purchaseCount,
      isBundle: p.isBundle,
    })),
  }

  if (!token?.sub) {
    return {
      props: baseProps,
    }
  }

  const purchaseForProduct = commerceProps.props.purchases?.find(
    (purchase: Purchase) => {
      return allProducts.some(
        (p) => p?.product.productId === purchase.productId,
      )
    },
  )

  if (!purchaseForProduct) {
    return {
      props: baseProps,
    }
  }

  const {purchase, existingPurchase} = await getPurchaseDetails(
    purchaseForProduct.id,
    token.sub,
  )

  return {
    props: {
      ...baseProps,
      hasPurchasedCurrentProduct: Boolean(purchase),
      existingPurchase: convertToSerializeForNextResponse(existingPurchase),
    },
  }
}

export type EventPageProps = {
  event: Event
  quantityAvailable: number
  totalQuantity: number
  purchaseCount: number
  product: Product
  mdx: MDXRemoteSerializeResult
  hasPurchasedCurrentProduct: boolean
  existingPurchase: {id: string; product: {id: string; name: string}}
  purchases: Purchase[]
  userId: string
  bundleProduct?: SanityProduct
  allProducts: Array<{
    product: SanityProduct
    quantityAvailable: number
    totalQuantity: number
    purchaseCount: number
    isBundle: boolean
  }>
} & CommerceProps

const EventPage = (props: EventPageProps) => {
  const {hasPurchasedCurrentProduct, allProducts} = props

  // Get all purchased product IDs (individual + bundle)
  const purchasedProductIds = allProducts
    .map((p) => p.product?.productId)
    .filter(Boolean)

  return (
    <>
      {hasPurchasedCurrentProduct ? (
        <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
          <PurchasedEventTemplate {...props} />
        </PriceCheckProvider>
      ) : (
        <EventTemplate {...props} />
      )}
    </>
  )
}

export default EventPage
