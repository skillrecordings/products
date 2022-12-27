import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {getExercise} from 'lib/exercises'
import {VideoResourceProvider} from '../../../../video/use-video-resource'
import {LessonProvider} from '../../../../video/use-lesson'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.exercise as string

  const module = await getTutorial(params?.module as string)
  const exercise = await getExercise(exerciseSlug)

  return {
    props: {
      exercise,
      module,
      transcript: exercise.transcript,
      videoResourceId: exercise.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllTutorials()

  const paths = tutorials.reduce((acc: any[], tutorial: any) => {
    return [
      ...acc,
      ...tutorial.exercises.map((exercise: any) => {
        return {
          params: {
            module: tutorial.slug.current,
            exercise: exercise.slug,
          },
        }
      }),
    ]
  }, [])

  return {paths, fallback: 'blocking'}
}

const ExercisePage: React.FC<any> = ({
  exercise,
  module,
  transcript,
  videoResourceId,
}) => {
  return (
    <LessonProvider lesson={exercise} module={module}>
      <VideoResourceProvider videoResourceId={videoResourceId}>
        <ExerciseTemplate
          transcript={transcript}
          videoResourceId={videoResourceId}
        />
      </VideoResourceProvider>
    </LessonProvider>
  )
}

export default ExercisePage
