import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {getAllWorkshops, getWorkshop, Workshop} from '@/lib/workshops'
import {ModuleTemplate} from '@/templates/module-template'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const workshop = await getWorkshop(params?.module as string)

  const moduleWithSectionsAndLessons = {
    ...workshop,
    useResourcesInsteadOfSections: true,
  }
  const moduleBodySerialized = workshop.body
    ? await serializeMDX(workshop.body)
    : null

  return {
    props: {module: moduleWithSectionsAndLessons, moduleBodySerialized},
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

const WorkshopPage: React.FC<{
  module: Module
  moduleBodySerialized: MDXRemoteSerializeResult
}> = ({module, moduleBodySerialized}) => {
  return (
    <ModuleProgressProvider moduleSlug={module.slug.current}>
      <ModuleTemplate
        module={module}
        moduleBodySerialized={moduleBodySerialized}
      />
    </ModuleProgressProvider>
  )
}

export default WorkshopPage
