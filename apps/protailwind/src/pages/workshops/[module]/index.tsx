import React from 'react'
import {SanityDocument} from '@sanity/client'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllWorkshops, getWorkshop} from '../../../lib/workshops'
import WorkshopTemplate from '../../../templates/workshop-template'

import {trpc} from '../../../utils/trpc'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const workshop = await getWorkshop(params?.module as string)

  return {
    props: {workshop},
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
  workshop: SanityDocument
}> = ({workshop}) => {
  const {data: commerceProps} = trpc.pricing.propsForCommerce.useQuery()
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return <WorkshopTemplate workshop={workshop} commerceProps={commerceProps} />
}

export default WorkshopPage
