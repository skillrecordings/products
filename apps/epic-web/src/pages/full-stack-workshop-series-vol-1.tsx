import React from 'react'
import {GetStaticProps} from 'next'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {getProduct, Product} from 'lib/products'
import ProductTemplate from 'templates/product-template'

export const getStaticProps: GetStaticProps = async (context) => {
  const product = await getProduct(
    'kcd_product-f000186d-78c2-4b02-a763-85b2e5feec7b',
  )

  const mdx = product.body && (await serializeMDX(product.body))
  return {
    props: {product, mdx},
    revalidate: 10,
  }
}

type ProductPageProps = {
  product: Product
  mdx: MDXRemoteSerializeResult
}

const EventPage: React.FC<ProductPageProps> = ({product, mdx}) => {
  return <ProductTemplate product={product} mdx={mdx} />
}

export default EventPage
