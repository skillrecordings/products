import React from 'react'
import Layout from 'components/layout'
import {InferGetServerSidePropsType, GetServerSideProps} from 'next'
import {z} from 'zod'
import {getModule, ModuleSchema} from 'lib/modules'
import {ModuleListing} from 'components/module-listing'
import {PortableText} from '@portabletext/react'

const ModulePageParamsSchema = z
  .object({
    module: z.string(),
  })
  .transform(({module}) => {
    return {moduleSlug: module}
  })

export const getServerSideProps: GetServerSideProps<{
  module: z.infer<typeof ModuleSchema>
}> = async ({params}) => {
  const {moduleSlug} = ModulePageParamsSchema.parse(params)

  const module = await getModule(moduleSlug)

  return {
    props: {
      module,
    },
  }
}

const Module = ({
  module,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {title} = module

  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <div className="max-w-screen-sm text-center font-light">
          <h1 className="font-heading py-8 text-4xl font-bold lg:text-5xl">
            {title}
          </h1>
          <div className="mb-2">
            <PortableText value={module.body} />
          </div>
          <div className="flex flex-col items-start justify-start text-left">
            <ModuleListing module={module} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Module
