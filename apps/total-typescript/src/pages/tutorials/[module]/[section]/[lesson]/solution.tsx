import React from 'react'
import ExerciseTemplate from '@/templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {getAllTutorials, getTutorial} from '@/lib/tutorials'
import {getExercise, Exercise} from '@/lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {getSection} from '@/lib/sections'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import truncateMarkdown from 'markdown-truncate'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getTutorial(params?.module as string)
  const exercise = await getExercise(exerciseSlug)

  if (!exercise) {
    return {
      notFound: true,
    }
  }

  const section = await getSection(sectionSlug)
  const solution = exercise.solution
  const solutionBodySerialized =
    typeof solution?.body === 'string' &&
    (await serializeMDX(solution.body, {
      syntaxHighlighterOptions: {
        theme: 'dark-plus',
        showCopyButton: true,
      },
    }))
  const solutionBodyPreviewSerialized =
    typeof solution?.body === 'string' &&
    (await serializeMDX(
      truncateMarkdown(solution.body, {limit: 300, ellipsis: false}),
      {
        syntaxHighlighterOptions: {
          theme: 'dark-plus',
        },
      },
    ))
  return {
    props: {
      solution: solution,
      solutionBodySerialized,
      solutionBodyPreviewSerialized,
      module,
      section,
      transcript: solution?.transcript,
      videoResourceId: solution?.videoResourceId,
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

const ExerciseSolution: React.FC<any> = ({
  solution,
  solutionBodySerialized,
  solutionBodyPreviewSerialized,
  module,
  section,
  transcript,
  videoResourceId,
}) => {
  return (
    <ModuleProgressProvider moduleSlug={module.slug.current}>
      <LessonProvider lesson={solution} module={module} section={section}>
        <VideoResourceProvider videoResourceId={videoResourceId}>
          <ExerciseTemplate
            transcript={transcript}
            lessonBodySerialized={solutionBodySerialized}
            lessonBodyPreviewSerialized={solutionBodyPreviewSerialized}
          />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default ExerciseSolution
