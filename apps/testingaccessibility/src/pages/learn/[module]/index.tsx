import React from 'react'
import {
  getAllModuleSlugs,
  getAvailableModulesForUser,
  getModule,
} from 'lib/modules'
import ModuleTemplate from 'templates/module-template'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../../../utils/honeycomb-tracer'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  params,
}) => {
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })
  // get array of available modules
  const availableModules = await getAvailableModulesForUser(req)

  // determine current module based on the url
  const currentModule: {slug: string} | undefined = find(availableModules, {
    slug: params?.module as string,
  })

  const allModules = await getAllModuleSlugs()

  // if the module doesn't exist
  if (isEmpty(find(allModules, {slug: params?.module}))) {
    return {
      notFound: true,
    }
  }

  // if the module is not found, user is trying to access a module that is not included in their purchase
  if (isEmpty(currentModule)) {
    // they need to upgrade
    return {
      redirect: {
        destination: '/buy',
        permanent: false,
      },
    }
  }

  const data = await getModule(currentModule?.slug as string)

  return {
    props: {module: data},
  }
}

type ModulePageProps = {
  module: SanityDocument
}

const ModulePage: React.FC<React.PropsWithChildren<ModulePageProps>> = ({
  module,
}) => {
  return <ModuleTemplate module={module} />
}

export default ModulePage
