import {Event, getAllEvents, getEvent} from 'lib/events'
import React from 'react'
import {GetServerSideProps, GetStaticPaths, GetStaticProps} from 'next'
import EventTemplate from 'templates/event-template'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {getSdk} from '@skillrecordings/database'
import {getAvailableBonuses} from 'lib/available-bonuses'
import {getToken} from 'next-auth/jwt'
import {getProductBySlug} from '@skillrecordings/skill-lesson/path-to-purchase/products.server'
import {getWorkshop} from 'lib/workshops'
import {
  convertToSerializeForNextResponse,
  propsForCommerce,
} from '@skillrecordings/commerce-server'
import {Purchase} from 'pages/products/[slug]'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query, params} = context
  const {getPurchaseDetails} = getSdk()
  const availableBonuses = await getAvailableBonuses()
  const token = await getToken({req})
  const event = await getEvent(params?.event as string)
  const product = await getProductBySlug(event.product?.slug as string)
  const mdx = event.body && (await serializeMDX(event.body))

  if (!event) {
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
      props: {...commerceProps.props, event, product, mdx, availableBonuses},
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
    },
  }
}

export type EventPageProps = {
  event: Event
  mdx: MDXRemoteSerializeResult
} & CommerceProps

const EventPage = (props: EventPageProps) => {
  return <EventTemplate {...props} />
}

export default EventPage
