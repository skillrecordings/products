import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetServerSideProps, GetStaticPaths, GetStaticProps} from 'next'
import {getAllTutorials, getModule} from 'lib/tutorials'
import {getExercise} from 'lib/exercises'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.exercise as string

  const module = await getModule(params?.module as string)
  const exercise = await getExercise(exerciseSlug)

  return {
    props: {exercise, module},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllTutorials()

  const paths = tutorials
    .reduce((acc: any[], tutorial: any) => {
      return tutorial.exercises.map((exercise: any) => {
        return {
          params: {
            module: tutorial.slug.current,
            exercise: exercise.slug.current,
          },
        }
      })
    }, [])
    .flatMap((path: any) => path)
  return {paths, fallback: 'blocking'}
}

const ExerciseSolution: React.FC<any> = ({exercise, module}) => {
  return (
    <ExerciseTemplate exercise={exercise} module={module} isSolution={true} />
  )
}

export default ExerciseSolution
