import React from 'react'

import {User} from '@skillrecordings/database'
import {SanityDocument} from '@sanity/client'
import {GetStaticPaths, GetStaticProps} from 'next'
import WorkshopTemplate from '../../../templates/workshop-template'
import {getAllWorkshops, getWorkshop} from '../../../lib/workshops'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'

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
  const paths = workshops.map((workshop: any) => {
    return {
      params: {module: workshop.slug.current},
    }
  })
  return {paths, fallback: 'blocking'}
}

const WorkshopPage: React.FC<{
  workshop: Module
}> = ({workshop}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return <WorkshopTemplate workshop={workshop} />
}

export default WorkshopPage
