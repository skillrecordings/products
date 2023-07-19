import React from 'react'

import {User} from '@skillrecordings/database'
import {SanityDocument} from '@sanity/client'
import {GetStaticPaths, GetStaticProps} from 'next'
import WorkshopTemplate from '../../../templates/workshop-template'
import {getAllWorkshops, getWorkshop} from '../../../lib/workshops'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {getProductBySlug} from '@skillrecordings/skill-lesson/path-to-purchase/products.server'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const workshop = await getWorkshop(params?.module as string)
  const workshopBodySerialized = await serializeMDX(workshop.body)
  const product = await getProductBySlug(params?.module as string)

  return {
    props: {workshop, workshopBodySerialized, product},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const workshops = await getAllWorkshops()
  const paths = workshops.map((workshop: any) => {
    return {
      params: {module: workshop.slug.current},
    }
  })
  return {paths, fallback: 'blocking'}
}

const WorkshopPage: React.FC<{
  workshop: Module
  workshopBodySerialized: MDXRemoteSerializeResult
  product: SanityProduct
}> = ({workshop, workshopBodySerialized, product}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return (
    <ModuleProgressProvider moduleSlug={workshop.slug.current}>
      <WorkshopTemplate
        product={product}
        workshop={workshop}
        workshopBodySerialized={workshopBodySerialized}
      />
    </ModuleProgressProvider>
  )
}

export default WorkshopPage
