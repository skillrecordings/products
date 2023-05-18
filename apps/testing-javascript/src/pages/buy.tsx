import React from 'react'
import Image from 'next/image'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {propsForCommerce} from '@skillrecordings/commerce-server'

import Layout from 'components/layout'
import PricingSection from 'components/pricing-section'
import {getAllProducts} from 'server/products.server'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query} = context
  const token = await getToken({req})
  const products = await getAllProducts()
  const {props: commerceProps} = await propsForCommerce({
    query,
    token,
    products,
  })

  return {
    props: {
      commerceProps,
    },
  }
}

const Buy: React.FC<any> = ({commerceProps}) => {
  return (
    <Layout
      meta={{
        title: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE} Workshops`,
        // TODO: Use correct image and alt here
        ogImage: {
          url: 'https://res.cloudinary.com/pro-tailwind/image/upload/v1673953704/buy-card_2x.png',
          alt: 'Testing Javascript Workshops',
        },
      }}
    >
      <PricingSection
        commerceProps={commerceProps}
        className="mt-12 mb-28 md:mt-14 lg:mt-16 lg:mb-32"
      />
    </Layout>
  )
}

export default Buy
