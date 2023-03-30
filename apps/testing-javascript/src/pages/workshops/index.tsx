import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {isEmpty} from 'lodash'
import {PortableText} from '@portabletext/react'

import {getProductById} from '../../lib/resources'
import Layout from 'components/layout'
import PortableTextComponents from 'components/portable-text'

export async function getStaticProps() {
  const product = await getProductById('product-273899')
  return {
    props: {product},
    revalidate: 10,
  }
}

const WorkshopsIndex: React.FC<{product: any}> = ({product}) => {
  return (
    <Layout>
      <main className="relative z-10 flex flex-col items-center justify-center py-20">
        <div className="container">
          <h2 className="text-4xl mb-4 text-primary-500 font-bold">
            Product: {product[0].title}
          </h2>
          <h3 className="mb-20 text-xl">{product[0].description}</h3>
          <h2 className="text-4xl mb-8 text-primary-500 font-bold">
            Workshops:
          </h2>
          {!isEmpty(product[0]) && (
            <div className="space-y-8">
              {product[0].modules.map((module: any) => {
                return (
                  <div
                    key={module.slug}
                    className="flex flex-col md:flex-row border border-gray-400 p-4 space-x-4"
                  >
                    <div className="shrink-0">
                      <Image
                        src={module.image.url}
                        width={150}
                        height={150}
                        alt={module.title}
                      />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-xl">
                        <Link
                          href={{
                            pathname: '/workshops/[module]',
                            query: {
                              module: module.slug,
                            },
                          }}
                          className="hover:underline"
                        >
                          {module.title}
                        </Link>
                      </h3>
                      <div className="text-gray-600 font-mono text-sm">
                        {module?.lessons.length} lessons
                      </div>
                      <div>{module.description}</div>
                      <article className="prose w-full max-w-none pb-10 text-gray-900 lg:max-w-xl">
                        <PortableText
                          value={module.body}
                          components={PortableTextComponents}
                        />
                      </article>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}

export default WorkshopsIndex
