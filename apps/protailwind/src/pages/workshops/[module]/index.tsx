import React from 'react'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {type Section} from '@skillrecordings/skill-lesson/schemas/section'
import {type SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllWorkshops, getWorkshop} from '../../../lib/workshops'
import WorkshopTemplate from '../../../templates/workshop-template'

import {trpc} from '../../../trpc/trpc.client'
import {useRouter} from 'next/router'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const workshop = await getWorkshop(params?.module as string)
  const workshopBodySerialized = await serializeMDX(workshop.body, {
    syntaxHighlighterOptions: {
      theme: 'one-dark-pro',
    },
  })
  return {
    props: {workshop, workshopBodySerialized},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const workshops = await getAllWorkshops()
  const paths = workshops.map((workshop: any) => ({
    params: {module: workshop.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const WorkshopPage: React.FC<{
  workshop: Module & {
    description: string
    ogImage: string
    sections: Section[]
    product: SanityProduct
  }
  workshopBodySerialized: MDXRemoteSerializeResult
}> = ({workshop, workshopBodySerialized}) => {
  const router = useRouter()
  const {data: commerceProps} = trpc.pricing.propsForCommerce.useQuery(
    router.query,
  )
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return (
    <ModuleProgressProvider moduleSlug={workshop.slug.current}>
      <WorkshopTemplate
        workshop={workshop}
        workshopBodySerialized={workshopBodySerialized}
        commerceProps={commerceProps}
      />
    </ModuleProgressProvider>
  )
}

export default WorkshopPage
