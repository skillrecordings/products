import React from 'react'
import LessonTemplate from '@/templates/lesson-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getExercise} from '@/lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {getSection} from '@/lib/sections'
import {getAllLegacyModules, getLegacyModule} from '@/lib/legacy-modules'
import {serialize} from 'next-mdx-remote/serialize'
import {getAllBonuses, getBonus} from '@/lib/bonuses'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {modulesIntegration} from '@sentry/nextjs'

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
  const lessonSlug = params?.lesson as string
  const moduleSlug = params?.module as string
  const isBonusModule = moduleSlug === 'epic-react-expert-interviews'
  const module = isBonusModule
    ? await getBonus(moduleSlug)
    : await getLegacyModule(moduleSlug)

  if (!module) {
    return {
      notFound: true,
    }
  }

  const moduleWithSectionsAndLessons = {
    ...module,
    useResourcesInsteadOfSections: true,
  }

  const _section = getSectionForLesson(module, lessonSlug)
  const section = _section ? await getSection(_section?.slug) : null
  const lesson = await getExercise(lessonSlug, false)

  const lessonBodySerialized =
    typeof lesson.body === 'string' &&
    (await serialize(lesson.body, {
      mdxOptions: {
        rehypePlugins: [],
      },
    }))

  return {
    props: {
      lesson,
      lessonBodySerialized,
      lessonBodyPreviewSerialized: lessonBodySerialized,
      module: moduleWithSectionsAndLessons,
      section,
      transcript: lesson.transcript,
      videoResourceId: lesson.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllLegacyModules()
  const bonuses = await getAllBonuses()

  const paths = [...tutorials, ...bonuses].flatMap((tutorial: any) => {
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
  lessonBodySerialized,
  lessonBodyPreviewSerialized,
  module,
  section,
  transcript,
  videoResourceId,
}) => {
  return (
    <ModuleProgressProvider moduleSlug={module.slug.current}>
      <LessonProvider lesson={lesson} module={module} section={section}>
        <VideoResourceProvider videoResourceId={videoResourceId}>
          <LessonTemplate
            transcript={transcript}
            lessonBodySerialized={lessonBodySerialized}
            lessonBodyPreviewSerialized={lessonBodyPreviewSerialized}
          />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default ExercisePage
