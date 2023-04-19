import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {getExercise} from 'lib/exercises'
import path from 'path'
import {walk} from 'utils/code-editor-content'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {getSection} from '@skillrecordings/skill-lesson/lib/sections'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const lessonSLug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getTutorial(params?.module as string)
  const section = await getSection(sectionSlug)
  const lesson = await getExercise(lessonSLug)

  const tutorialDirectory = path.join(
    process.cwd(),
    'src/exercise/sandpack/parcel',
  )
  const tutorialFiles = walk(tutorialDirectory)

  return {
    props: {
      lesson,
      section,
      module,
      tutorialFiles,
      transcript: lesson.transcript,
      videoResourceId: lesson.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllTutorials()

  // flatMap to extract lessons in sections from tutorials
  const paths = tutorials.flatMap((tutorial: any) => {
    return (
      tutorial.sections?.flatMap((section: any) => {
        return (
          section.lessons?.map((lesson: any) => ({
            params: {
              module: tutorial.slug.current,
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

const ExercisePage: React.FC<any> = ({
  lesson,
  module,
  section,
  tutorialFiles,
  transcript,
  videoResourceId,
}) => {
  return (
    <ModuleProgressProvider moduleSlug={module.slug.current}>
      <LessonProvider lesson={lesson} module={module} section={section}>
        <VideoResourceProvider videoResourceId={videoResourceId}>
          <ExerciseTemplate
            transcript={transcript}
            tutorialFiles={tutorialFiles}
          />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default ExercisePage
