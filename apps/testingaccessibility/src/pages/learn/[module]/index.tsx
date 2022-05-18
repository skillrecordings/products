import React from 'react'
import {getPurchasedProduct} from 'server/get-purchased-product'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import ModuleTemplate from 'templates/module-template'
import flatten from 'lodash/flatten'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import groq from 'groq'

const allModulesQuery = groq`*[_type == "module"]{
      "slug": slug.current
  }`

const moduleQuery = groq`*[_type == "module" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  body,
  sections[]->{
      title,
      "slug": slug.current,
      body[]{
      ...,
      markDefs[]{
        ...,
      _type == "internalLink" => {
        "_id": @.reference->_id,
        "slug": @.reference->slug,
        "type": @.reference->_type,
        "modules": *[_type=='module']{
          "slug": slug.current,
          sections[]->{
            "slug": slug.current,
            lessons[]->{
              "slug": slug.current,
            }
          }
        }
      }
    }
      },
      image{
        url,
        alt
      },
      lessons[]->{
        title,
        "slug": slug.current
      }
    }
  }`

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const {product} = await getPurchasedProduct(req)

  // get array of available modules
  const modules: {slug: string}[] = flatten(
    product.modules.map((module: SanityDocument) => module),
  )

  // determine current module based on the url
  const currentModule: {slug: string} | undefined = find(modules, {
    slug: params?.module as string,
  })

  const allModules = await sanityClient.fetch(allModulesQuery)

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

  const data = await sanityClient.fetch(moduleQuery, {
    slug: currentModule?.slug,
  })

  return {
    props: {module: data},
  }
}

type ModulePageProps = {
  module: SanityDocument
}

const ModulePage: React.FC<ModulePageProps> = ({module}) => {
  return <ModuleTemplate module={module} />
}

export default ModulePage
