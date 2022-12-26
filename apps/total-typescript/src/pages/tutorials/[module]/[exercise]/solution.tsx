import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {getExercise} from 'lib/exercises'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.exercise as string

  const module = await getTutorial(params?.module as string)
  const exercise = await getExercise(exerciseSlug)

  return {
    props: {
      solution: exercise.solution,
      module,
      videoThumbId: exercise?.solution?.muxPlaybackId,
      transcript: exercise.solution?.transcript,
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

const ExerciseSolution: React.FC<any> = ({
  solution,
  module,
  videoThumbId,
  transcript,
}) => {
  return (
    <ExerciseTemplate
      exercise={solution}
      module={module}
      videoThumbId={videoThumbId}
      transcript={transcript}
    />
  )
}

export default ExerciseSolution
