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

  const product = await getProductBySlug(event.product?.slug as string)
  const mdx = event.body && (await serializeMDX(event.body))

  const commerceProps = await propsForCommerce({
    query,
    token,
    products: [product],
  })

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

  if (!token?.sub) {
    return {
      props: {
        ...commerceProps.props,
        event,
        product,
        mdx,
        availableBonuses,
        quantityAvailable:
          (productWithQuantityAvailable &&
            productWithQuantityAvailable.quantityAvailable - purchaseCount) ||
          -1,
        purchaseCount,
      },
    }
  }

  const purchaseForProduct = commerceProps.props.purchases?.find(
    (purchase: Purchase) => {
      return purchase.productId === product.productId
    },
  )

  if (!purchaseForProduct) {
    return {
      props: {...commerceProps.props, event, availableBonuses},
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
      event,
      mdx,
      quantityAvailable: productWithQuantityAvailable?.quantityAvailable || -1,
      purchaseCount,
    },
  }
}

export type EventPageProps = {
  event: Event
  quantityAvailable: number
  purchaseCount: number
  product: Product
  mdx: MDXRemoteSerializeResult
  hasPurchasedCurrentProduct: boolean
  existingPurchase: {id: string; product: {id: string; name: string}}
  purchases: Purchase[]
  userId: string
} & CommerceProps

const EventPage = (props: EventPageProps) => {
  const {hasPurchasedCurrentProduct} = props

  return (
    <>
      {hasPurchasedCurrentProduct ? (
        <PriceCheckProvider purchasedProductIds={[props.product.productId]}>
          <PurchasedEventTemplate {...props} />
        </PriceCheckProvider>
      ) : (
        <EventTemplate {...props} />
      )}
    </>
  )
}

export default EventPage
