import Layout from 'components/app/layout'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import React from 'react'
import Image from 'next/image'

export async function getStaticProps() {
  const products = await getAllProducts()

  return {
    props: {products},
    revalidate: 10,
  }
}

type ProductsIndexProps = {
  products: SanityProduct[]
}

const ProductsIndex: React.FC<ProductsIndexProps> = ({products}) => {
  return (
    <Layout meta={{title: `${process.env.NEXT_PUBLIC_SITE_TITLE} Products`}}>
      <header className="flex items-center justify-center px-5 py-32">
        <h1 className="text-center font-heading text-4xl font-semibold">
          Products
        </h1>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-5">
        {products?.map((product) => {
          return (
            <article className="flex bg-gray-800">
              {/* <pre>{JSON.stringify(product, null, 2)}</pre> */}
              {product.image && (
                <Image
                  src={product.image.url}
                  alt={product.title || `Product's image`}
                  width={300}
                  height={300}
                />
              )}
              {product.title}
            </article>
          )
        })}
      </main>
    </Layout>
  )
}

export default ProductsIndex
