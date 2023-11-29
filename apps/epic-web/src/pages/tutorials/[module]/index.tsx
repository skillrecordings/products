import React from 'react'
import TutorialTemplate from 'templates/tutorial-template'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const tutorial = await getTutorial(params?.module as string)

  if (!tutorial) {
    return {
      notFound: true,
    }
  }

  const tutorialBodySerialized = await serializeMDX(tutorial.body)

  return {
    props: {tutorial, tutorialBodySerialized},
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
  tutorial: Module
  tutorialBodySerialized: MDXRemoteSerializeResult
}> = ({tutorial, tutorialBodySerialized}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return (
    <ModuleProgressProvider moduleSlug={tutorial.slug.current}>
      <TutorialTemplate
        tutorial={tutorial}
        tutorialBodySerialized={tutorialBodySerialized}
      />
    </ModuleProgressProvider>
  )
}

export default TutorialPage
