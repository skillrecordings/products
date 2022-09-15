import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetServerSideProps} from 'next'
import {getModule} from 'lib/tutorials'
import {getExercise} from '../../../../lib/exercises'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.exercise as string

  const subscriber = context.req.cookies['ck_subscriber'] || null
  const tutorial = await getModule(params?.module as string)
  const exercise = await getExercise(exerciseSlug)

  if (!exercise) {
    return {
      notFound: true,
    }
  }

  return {
    props: {exercise, tutorial, subscriber, isSolution: true},
  }
}

const ExerciseSolution: React.FC<any> = ({
  exercise,
  tutorial,
  subscriber,
  isSolution,
}) => {
  return exercise ? (
    <ExerciseTemplate
      exercise={exercise}
      module={tutorial}
      subscriber={subscriber}
      isSolution={isSolution}
    />
  ) : null
}

export default ExerciseSolution
