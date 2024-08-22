import React from 'react'
import ExerciseTemplate from '@/templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {getExercise, Exercise} from '@/lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {serialize} from 'next-mdx-remote/serialize'
import {remarkCodeBlocksShiki} from '@kentcdodds/md-temp'
import {removePreContainerDivs, trimCodeBlocks} from '@/utils/mdx'
import * as Sentry from '@sentry/nextjs'
import {
  getAllWorkshops,
  getModuleLessonPath,
  getWorkshop,
} from '@/lib/workshops'
import {getSection} from '@/lib/sections'

type ModuleWithResources = {
  slug: {current: string}
  resources: {
    _type: 'lesson' | 'exercise' | 'explainer' | 'interview' | 'section'
    slug: string
    lessons?: {_type: string; slug: string}[]
  }[]
}

const getSectionForLesson = (
  module: ModuleWithResources,
  lessonSlug: string,
) => {
  const lessonIsTopLevel = Boolean(
    module.resources.find((resource) => {
      return resource._type !== 'section' && resource.slug === lessonSlug
    }),
  )

  if (lessonIsTopLevel) {
    return null
  } else {
    const section = module.resources.find((resource) => {
      if (
        resource._type === 'section' &&
        'lessons' in resource &&
        resource.lessons
      ) {
        return resource.lessons.some((lesson) => {
          return lesson.slug === lessonSlug
        })
      }

      return false
    })

    return section || null
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getWorkshop(params?.module as string)
  const _section = getSectionForLesson(module, exerciseSlug)
  const section = _section ? await getSection(_section?.slug) : null
  const exercise = await getExercise(exerciseSlug)
  const moduleWithSectionsAndLessons = {
    ...module,
    useResourcesInsteadOfSections: true,
  }
  if (!exercise) {
    const msg = `Unable to find Exercise for slug (${exerciseSlug}). Context: module (${params?.module}))`
    Sentry.captureMessage(msg)

    return {
      notFound: true,
    }
  }

  const solution = exercise.solution
  const lesson = exercise

  const solutionBodySerialized =
    typeof solution?.body === 'string' &&
    (await serialize(solution.body, {
      mdxOptions: {
        rehypePlugins: [
          trimCodeBlocks,
          remarkCodeBlocksShiki,
          removePreContainerDivs,
        ],
      },
    }))

  return {
    props: {
      lesson,
      solution,
      solutionBodySerialized,
      solutionBodyPreviewSerialized: solutionBodySerialized,
      module: moduleWithSectionsAndLessons,
      section,
      transcript: solution?.transcript,
      videoResourceId: solution?.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const workshops = await getAllWorkshops()

  const paths = workshops.flatMap((tutorial: any) => {
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
            lessonPathBuilder={getModuleLessonPath}
          />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default ExerciseSolution
