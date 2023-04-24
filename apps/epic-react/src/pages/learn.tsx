import React from 'react'
import Layout from 'components/layout'
import {InferGetServerSidePropsType, GetServerSideProps} from 'next'
import {getProductModules, ProductModulesSchema} from 'lib/modules'
import {z} from 'zod'

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
            <ul className="list-none pl-0">
              {modules.map((module) => {
                return (
                  <li className="mb-4 text-lg font-semibold">
                    {module.title}
                    <ul className="mt-2 list-inside list-disc pl-4">
                      {module.resources.map((resource) => {
                        if (resource._type === 'section') {
                          // asserting that this should be defined in this case
                          const sectionResources =
                            resource.resources as NonNullable<
                              typeof resource.resources
                            >

                          return (
                            <li className="mt-1 font-medium">
                              {resource.title}
                              <ul className="mt-1 list-inside list-decimal pl-6">
                                {sectionResources.map((lesson) => {
                                  return (
                                    <li>
                                      <a
                                        href={`${module.slug}/${lesson.slug}`}
                                        className="font-semibold underline"
                                      >
                                        {lesson.title}
                                      </a>
                                    </li>
                                  )
                                })}
                              </ul>
                            </li>
                          )
                        } else {
                          return (
                            <li className="mt-1 font-medium">
                              <a
                                href={`${module.slug}/${resource.slug}`}
                                className="font-semibold underline"
                              >
                                {resource.title}
                              </a>
                            </li>
                          )
                        }
                      })}
                    </ul>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Modules
