import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import TutorialTemplate from '@/templates/tutorial-template'
import {getAllWorkshops, getWorkshop, Workshop} from '@/lib/workshops'
import {WorkshopTemplate} from '@/templates/workshop-template'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const workshop = await getWorkshop(params?.module as string)

  const workshopBodySerialized = workshop.body
    ? await serializeMDX(workshop.body)
    : null

  return {
    props: {workshop, workshopBodySerialized},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const workshops = await getAllWorkshops()
  const paths = workshops.map((workshop) => ({
    params: {module: workshop.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const TutorialPage: React.FC<{
  workshop: Workshop
  workshopBodySerialized: MDXRemoteSerializeResult
}> = ({workshop, workshopBodySerialized}) => {
  return (
    <ModuleProgressProvider moduleSlug={workshop.slug.current}>
      <WorkshopTemplate
        workshop={workshop}
        workshopBodySerialized={workshopBodySerialized}
      />
    </ModuleProgressProvider>
  )
}

export default TutorialPage
