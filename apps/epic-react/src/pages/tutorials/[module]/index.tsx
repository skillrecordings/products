import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {getAllTutorials, getTutorial, type Tutorial} from '@/lib/tutorials'
import TutorialTemplate from '@/templates/tutorial-template'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const tutorial = await getTutorial(params?.module as string)

  const tutorialBodySerialized = tutorial.body
    ? await serializeMDX(tutorial.body)
    : null

  return {
    props: {tutorial, tutorialBodySerialized},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tutorials = await getAllTutorials()
  const paths = tutorials.map((tutorial) => ({
    params: {module: tutorial.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const TutorialPage: React.FC<{
  tutorial: Tutorial
  tutorialBodySerialized: MDXRemoteSerializeResult
}> = ({tutorial, tutorialBodySerialized}) => {
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
