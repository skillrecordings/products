import React from 'react'

import TutorialTemplate from 'templates/tutorial-template'
import {User} from '@skillrecordings/database'
import {SanityDocument} from '@sanity/client'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getWorkshop} from '../../../lib/workshops'
import WorkshopTemplate from '../../../templates/workshop-template'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const tutorial = await getWorkshop(params?.module as string)

  return {
    props: {tutorial},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tutorials = await getAllTutorials()
  const paths = tutorials.map((tutorial: any) => ({
    params: {module: tutorial.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const TutorialPage: React.FC<{
  tutorial: SanityDocument
}> = ({tutorial}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return <WorkshopTemplate workshop={tutorial} />
}

export default TutorialPage
