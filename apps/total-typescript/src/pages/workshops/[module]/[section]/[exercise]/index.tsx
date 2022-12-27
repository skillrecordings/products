import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getExercise, getExerciseMedia} from 'lib/exercises'
import {getAllWorkshops, getWorkshop} from 'lib/workshops'
import {getSection} from 'lib/sections'
import {VideoResourceProvider} from '../../../../../video/use-video-resource'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.exercise as string
  const sectionSlug = params?.section as string

  const module = await getWorkshop(params?.module as string)
  const exercise = await getExercise(exerciseSlug, false)
  const section = await getSection(sectionSlug)

  return {
    props: {
      exercise,
      module,
      section,
      transcript: exercise.transcript,
      videoResourceId: exercise.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const workshops = await getAllWorkshops()

  // flatMap to extract exercises in sections from workshops
  const paths = workshops.flatMap((workshop: any) => {
    return (
      workshop.sections?.flatMap((section: any) => {
        return (
          section.exercises?.map((exercise: any) => ({
            params: {
              module: workshop.slug.current,
              section: section.slug,
              exercise: exercise.slug,
            },
          })) || []
        )
      }) || []
    )
  })

  return {paths, fallback: 'blocking'}
}

const ExercisePage: React.FC<any> = ({
  exercise,
  module,
  section,
  transcript,
  videoResourceId,
}) => {
  return (
    <VideoResourceProvider videoResourceId={videoResourceId}>
      <ExerciseTemplate
        exercise={exercise}
        section={section}
        module={module}
        transcript={transcript}
        videoResourceId={videoResourceId}
      />
    </VideoResourceProvider>
  )
}

export default ExercisePage
