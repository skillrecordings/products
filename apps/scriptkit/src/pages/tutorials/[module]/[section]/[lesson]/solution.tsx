import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {getExercise, Exercise} from 'lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {getSection} from 'lib/sections'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getTutorial(params?.module as string)
  const lesson = await getExercise(exerciseSlug)
  const section = await getSection(sectionSlug)
  const lessonBody =
    typeof lesson.body === 'string' &&
    lesson.body &&
    (await serializeMDX(lesson.body, {
      syntaxHighlighterOptions: {theme: 'material-theme-darker'},
    }))
  const lessonBodyPreview =
    typeof lesson.body === 'string' &&
    lesson.body &&
    (await serializeMDX(lesson.body.substring(0, 300)))

  return {
    props: {
      lessonBody,
      lessonBodyPreview,
      solution: lesson.solution,
      module,
      section,
      transcript: lesson.solution?.transcript,
      videoResourceId: lesson.solution?.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllTutorials()

  const paths = tutorials.flatMap((tutorial: any) => {
    return (
      tutorial.sections?.flatMap((section: any) => {
        return (
          section.lessons
            ?.filter(({_type}: Lesson) => _type === 'exercise')
            .map((exercise: Exercise) => ({
              params: {
                module: tutorial.slug.current,
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

type ExerciseSolutionPageProps = {
  solution: Lesson
  module: Module
  section: Section
  transcript: string
  videoResourceId: string
  lessonBody: MDXRemoteSerializeResult
  lessonBodyPreview: MDXRemoteSerializeResult
}

const ExerciseSolution: React.FC<ExerciseSolutionPageProps> = ({
  solution,
  module,
  section,
  transcript,
  videoResourceId,
  lessonBody,
  lessonBodyPreview,
}) => {
  return (
    <ModuleProgressProvider moduleSlug={module.slug.current}>
      <LessonProvider lesson={solution} module={module} section={section}>
        <VideoResourceProvider videoResourceId={videoResourceId}>
          <ExerciseTemplate
            lessonBody={lessonBody}
            lessonBodyPreview={lessonBodyPreview}
            transcript={transcript}
          />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default ExerciseSolution
