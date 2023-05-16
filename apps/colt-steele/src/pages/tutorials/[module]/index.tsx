import React from 'react'
import TutorialTemplate from 'templates/tutorial-template'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {serialize} from 'next-mdx-remote/serialize'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const tutorial = await getTutorial(params?.module as string)
  const tutorialBody = tutorial.body && (await serialize(tutorial.body))

  return {
    props: {tutorial, tutorialBody},
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
  tutorialBody: MDXRemoteSerializeResult
}> = ({tutorial, tutorialBody}) => {
  return (
    <ModuleProgressProvider moduleSlug={tutorial.slug.current}>
      <TutorialTemplate tutorial={tutorial} tutorialBody={tutorialBody} />
    </ModuleProgressProvider>
  )
}

export default TutorialPage
