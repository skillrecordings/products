import React from 'react'
import Layout from 'components/layout'
import {InferGetServerSidePropsType, GetServerSideProps} from 'next'
import {getProductModules, ProductModulesSchema} from 'lib/modules'
import {z} from 'zod'
import {ModuleListing} from 'components/module-listing'

type ProductModules = z.infer<typeof ProductModulesSchema>

export const getServerSideProps: GetServerSideProps<ProductModules> = async ({
  params,
}) => {
  // figure out what product we are loading modules for
  const productId = 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38'

  // const {title, modules} = await getProductData()
  const result = await getProductModules({productId})

  return {
    props: {
      ...result,
    },
  }
}

const Modules = ({
  title,
  description,
  modules,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <div className="max-w-screen-sm text-center font-light">
          <h1 className="font-heading py-8 text-4xl font-bold lg:text-5xl">
            {title}
          </h1>
          <h2 className="font-heading py-8 text-4xl font-bold lg:text-2xl">
            {description}
          </h2>
          <p className="mx-auto pb-8 leading-relaxed sm:text-xl">
            There are {modules.length} modules in this product.
          </p>
          <div className="flex flex-col items-start justify-start text-left">
            {modules.map((module) => {
              return <ModuleListing module={module} />
            })}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Modules
