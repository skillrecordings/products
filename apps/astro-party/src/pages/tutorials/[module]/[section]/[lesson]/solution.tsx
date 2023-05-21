import React from 'react'
import LessonTemplate from 'templates/lesson-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {getExercise, Exercise} from 'lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {getSection} from 'lib/sections'
import {Resource} from '@skillrecordings/skill-lesson/schemas/resource'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {serialize} from 'next-mdx-remote/serialize'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getTutorial(params?.module as string)
  const exercise = await getExercise(exerciseSlug)
  const section = await getSection(sectionSlug)
  const solutionBody =
    exercise?.solution?.body &&
    (await serialize(String(exercise.solution.body)))
  const solutionBodyPreview =
    exercise?.solution?.body &&
    (await serialize(String(exercise.solution.body).substring(0, 300)))

  return {
    props: {
      solution: exercise.solution,
      solutionBody,
      solutionBodyPreview,
      module,
      section,
      transcript: exercise.solution?.transcript,
      videoResourceId: exercise.solution?.videoResourceId,
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

type ExerciseSolutionProps = {
  solution: Resource
  solutionBody: MDXRemoteSerializeResult
  solutionBodyPreview: MDXRemoteSerializeResult
  module: Module
  section: Section
  transcript: string
  videoResourceId: string
}

const ExerciseSolution: React.FC<ExerciseSolutionProps> = ({
  solution,
  solutionBody,
  solutionBodyPreview,
  module,
  section,
  transcript,
  videoResourceId,
}) => {
  return (
    <ModuleProgressProvider moduleSlug={module.slug.current}>
      <LessonProvider lesson={solution} module={module} section={section}>
        <VideoResourceProvider videoResourceId={videoResourceId}>
          <LessonTemplate
            transcript={transcript}
            lessonBody={solutionBody}
            lessonBodyPreview={solutionBodyPreview}
          />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default ExerciseSolution
