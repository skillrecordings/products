import React from 'react'
import ExerciseTemplate from 'templates/lesson-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {getLesson} from 'lib/lesson'
import path from 'path'
// import {walk} from 'utils/code-editor-content'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const lessonSlug = params?.lesson as string

  const module = await getTutorial(params?.module as string)
  const lesson = await getLesson(lessonSlug)

  return {
    props: {lesson, module},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllTutorials()

  const paths = tutorials.reduce((acc: any[], tutorial: any) => {
    return [
      ...acc,
      ...tutorial.lessons.map((lesson: any) => {
        return {
          params: {
            module: tutorial.slug.current,
            lesson: lesson.slug,
          },
        }
      }),
    ]
  }, [])

  return {paths, fallback: 'blocking'}
}

const ExercisePage: React.FC<any> = ({lesson, module, tutorialFiles}) => {
  return (
    <ExerciseTemplate
      exercise={lesson}
      module={module}
      tutorialFiles={tutorialFiles}
    />
  )
}

export default ExercisePage
