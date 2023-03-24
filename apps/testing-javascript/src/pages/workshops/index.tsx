import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {isEmpty} from 'lodash'

import Layout from 'components/layout'
import {getProductById} from '../../lib/resources'

export async function getStaticProps() {
  const product = await getProductById('product-273900')
  return {
    props: {product},
    revalidate: 10,
  }
}

const WorkshopsIndex: React.FC<{product: any}> = ({product}) => {
  return (
    <Layout>
      <main className="relative z-10 flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl mb-8 text-primary-500 font-bold">Workshops:</h1>
        {!isEmpty(product[0]) && (
          <div className="space-y-8">
            {product[0].modules.map((module: any) => {
              return (
                <div
                  key={module.slug}
                  className="flex flex-col md:flex-row border border-gray-400 p-4"
                >
                  <div>
                    <Image
                      src={module.image.url}
                      width={150}
                      height={150}
                      alt={module.title}
                    />
                  </div>
                  <div>
                    <Link
                      href={{
                        pathname: '/workshops/[workshop]',
                        query: {
                          workshop: module.slug,
                        },
                      }}
                    >
                      <h3 className="font-bold text-xl">{module.title}</h3>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </Layout>
  )
}

export default WorkshopsIndex
