import React from 'react'
import {getDecodedToken} from 'utils/get-decoded-token'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import {getSdk} from 'lib/prisma-api'
import SectionTemplate from 'templates/section-template'
import flatten from 'lodash/flatten'
import isEmpty from 'lodash/isEmpty'
import last from 'lodash/last'
import find from 'lodash/find'
import get from 'lodash/get'
import groq from 'groq'

const productQuery = groq`*[_type == "product" && productId == $productId][0]{
  productId,
  modules[]->{
    title,
    "slug": slug.current,
    sections[]->{
      "slug": slug.current
    }
  }
  }`

const allSectionsQuery = groq`*[_type == "section"]{
  "slug": slug.current,
  }`
const sectionQuery = groq`*[_type == "section" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  body,
  lessons[]->{
    title,
    "slug": slug.current
  }
  }`

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const sessionToken = await getDecodedToken(req)
  const {getPurchasesForUser} = getSdk()
  const purchases =
    sessionToken &&
    sessionToken.sub &&
    (await getPurchasesForUser(sessionToken.sub))
  const productId = purchases && get(last(purchases), 'productId')

  // fetch product from sanity based on user's productId associated with their purchase
  const product = await sanityClient.fetch(productQuery, {
    productId: productId,
  })

  // get array of available sections
  const sections: {slug: string}[] = flatten(
    product.modules.map((module: SanityDocument) =>
      module.sections.map((section: SanityDocument) => section),
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

  const module = find(product.modules, (module: SanityDocument) =>
    module.sections.includes(currentSection),
  )

  const data = await sanityClient.fetch(sectionQuery, {
    slug: currentSection?.slug,
  })

  return {
    props: {section: data, module},
  }
}

type SectionPageProps = {
  module: SanityDocument
  section: SanityDocument
}

const SectionPage: React.FC<SectionPageProps> = ({module, section}) => {
  return <SectionTemplate module={module} section={section} />
}

export default SectionPage
