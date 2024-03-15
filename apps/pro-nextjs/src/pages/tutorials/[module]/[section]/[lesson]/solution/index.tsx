import React from 'react'
import ExerciseTemplate from '@/templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {getExercise, Exercise} from '@/lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {getSection} from '@/lib/sections'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {getAllTutorials, getTutorial} from '@/lib/tutorials'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getTutorial(params?.module as string)
  const section = await getSection(sectionSlug)
  const exercise = await getExercise(exerciseSlug)
  const solution = exercise.solution
  const lesson = exercise
  const solutionBodySerialized =
    typeof solution?.body === 'string' &&
    (await serializeMDX(solution.body, {
      syntaxHighlighterOptions: {
        theme: 'material-default',
        showCopyButton: true,
      },
    }))
  const solutionBodyPreviewSerialized =
    typeof solution?.body === 'string' &&
    (await serializeMDX(solution.body.substring(0, 300), {
      syntaxHighlighterOptions: {
        theme: 'material-default',
      },
    }))

  return {
    props: {
      lesson,
      solution,
      solutionBodySerialized,
      solutionBodyPreviewSerialized,
      module,
      section,
      transcript: solution?.transcript?.text || null,
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
  lesson,
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
      <LessonProvider
        lesson={{...solution, slug: lesson.slug}}
        module={module}
        section={section}
      >
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
