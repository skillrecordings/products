import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {Exercise, getExercise} from 'lib/exercises'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {getAllWorkshops, getWorkshop} from '../../../../../lib/workshops'
import {getSection} from '@skillrecordings/skill-lesson/lib/sections'
import path from 'path'
import {walk} from '../../../../../utils/code-editor-content'
import {LessonResource} from '@skillrecordings/skill-lesson/schemas/lesson-resource'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const lessonSlug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getWorkshop(params?.module as string)
  const section = await getSection(sectionSlug)
  const lesson = await getExercise(lessonSlug)

  const tutorialDirectory = path.join(
    process.cwd(),
    'src/components/sandpack/parcel',
  )
  const tutorialFiles = walk(tutorialDirectory)

  return {
    props: {
      lesson: lesson.solution,
      section,
      module,
      tutorialFiles,
      transcript: lesson.solution?.transcript || [],
      videoResourceId: lesson.solution?.videoResourceId,
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
            ?.filter(({_type}: LessonResource) => _type === 'exercise')
            .map((lesson: any) => ({
              params: {
                module: workshop.slug.current,
                section: section.slug,
                lesson: lesson.slug,
              },
            })) || []
        )
      }) || []
    )
  })
  return {paths, fallback: 'blocking'}
}

const ExerciseSolution: React.FC<any> = ({
  lesson,
  section,
  module,
  transcript,
  videoResourceId,
}) => {
  return (
    <LessonProvider lesson={lesson} module={module} section={section}>
      <VideoResourceProvider videoResourceId={videoResourceId}>
        <ExerciseTemplate transcript={transcript} />
      </VideoResourceProvider>
    </LessonProvider>
  )
}

export default ExerciseSolution
