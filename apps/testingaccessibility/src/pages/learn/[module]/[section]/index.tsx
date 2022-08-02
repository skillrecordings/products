import React from 'react'
import {getPurchasedProduct} from 'server/get-purchased-product'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import SectionTemplate from 'templates/section-template'
import flatten from 'lodash/flatten'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import groq from 'groq'
import {tracer, setupHttpTracing} from '@skillrecordings/honeycomb-tracer'

const allSectionsQuery = groq`*[_type == "section"]{
  "slug": slug.current,
  }`
const sectionQuery = groq`*[_type == "section" && slug.current == $slug][0]{
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
        "hash": hash.current,
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
    },
    _type == "callout" => {
        ...,
        body[]{
          ...,
          markDefs[]{
          ...,
          _type == "internalLink" => {
            "_id": @.reference->_id,
            "slug": @.reference->slug,
            "type": @.reference->_type,
            "hash": hash.current,
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
  }`

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
  const {product} = await getPurchasedProduct(req)

  // get array of available sections
  const sections: {slug: string}[] = flatten(
    product.modules.map((module: SanityDocument) =>
      module?.sections?.map((section: SanityDocument) => section),
    ),
  )

  // determine current section based on the url
  const currentSection: {slug: string} | undefined = find(sections, {
    slug: params?.section as string,
  })

  const allSections = await sanityClient.fetch(allSectionsQuery)

  // if the section doesn't exist
  if (isEmpty(find(allSections, {slug: params?.section}))) {
    return {
      notFound: true,
    }
  }

  // if the section is not found, user is trying to access a section that is not included in their purchase
  if (isEmpty(currentSection)) {
    // they need to upgrade
    return {
      redirect: {
        destination: '/buy',
        permanent: false,
      },
    }
  }
  const modules = product.modules
  const module = find(product.modules, (module: SanityDocument) =>
    module?.sections?.includes(currentSection),
  )

  const data = await sanityClient.fetch(sectionQuery, {
    slug: currentSection?.slug,
  })

  return {
    props: {section: data, module, modules},
  }
}

type SectionPageProps = {
  module: SanityDocument
  section: SanityDocument
  modules: SanityDocument[]
}

const SectionPage: React.FC<React.PropsWithChildren<SectionPageProps>> = ({
  module,
  section,
  modules,
}) => {
  return <SectionTemplate module={module} section={section} modules={modules} />
}

export default SectionPage
