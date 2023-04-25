import React from 'react'
import Layout from 'components/layout'
import {NextPage, GetServerSideProps} from 'next'

const getProductData = async (): Promise<{
  title: string
  modules: Array<Object>
}> => {
  return new Promise<{
    title: string
    modules: Array<Object>
  }>((resolve) => resolve({title: 'Epic React', modules: []}))
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  // figure out what product we are loading modules for

  const {title, modules} = await getProductData()

  return {
    props: {
      product: {
        title,
        modules,
      },
    },
  }
}

const Modules: NextPage<{product: {title: string; modules: Array<Object>}}> = ({
  product,
}) => {
  const {title, modules} = product

  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <div className="max-w-screen-sm text-center font-light">
          <h1 className="font-heading py-8 text-4xl font-bold lg:text-5xl">
            {title}
          </h1>
          <p className="mx-auto pb-8 leading-relaxed sm:text-xl">
            There are {modules.length} modules in this product.
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default Modules
