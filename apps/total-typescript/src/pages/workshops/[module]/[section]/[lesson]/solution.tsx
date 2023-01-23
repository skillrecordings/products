import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Exercise, getExercise} from 'lib/exercises'
import {getAllWorkshops, getWorkshop} from 'lib/workshops'
import {getSection} from 'lib/sections'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getWorkshop(params?.module as string)
  const exercise = await getExercise(exerciseSlug)
  const section = await getSection(sectionSlug)

  return {
    props: {
      solution: exercise.solution,
      module,
      section,
      transcript: exercise.solution?.transcript,
      videoResourceId: exercise.solution?.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const workshops = await getAllWorkshops()

  // flatMap to extract lessons in sections from workshops
  const paths = workshops.flatMap((workshop: any) => {
    return (
      workshop.sections?.flatMap((section: any) => {
        return (
          section.lessons
            ?.filter(({_type}: Lesson) => _type === 'exercise')
            .map((exercise: Exercise) => ({
              params: {
                module: workshop.slug.current,
                section: section.slug,
                lesson: exercise.slug,
              },
            })) || []
        )
      }) || []
    )
  })

  return {paths, fallback: 'blocking'}
}

const ExerciseSolution: React.FC<any> = ({
  solution,
  module,
  section,
  transcript,
  videoResourceId,
}) => {
  return (
    <LessonProvider lesson={solution} module={module} section={section}>
      <VideoResourceProvider videoResourceId={videoResourceId}>
        <ExerciseTemplate transcript={transcript} />
      </VideoResourceProvider>
    </LessonProvider>
  )
}

export default ExerciseSolution
