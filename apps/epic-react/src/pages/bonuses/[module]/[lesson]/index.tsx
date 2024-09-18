import React from 'react'
import ExerciseTemplate from '@/templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getExercise} from '@/lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {serialize} from 'next-mdx-remote/serialize'
import {removePreContainerDivs, trimCodeBlocks} from '@/utils/mdx'
import * as Sentry from '@sentry/nextjs'
import {lessonPathBuilder} from '@/utils/lesson-path-builder'
import {getAllBonuses, getBonus, type Bonus} from '@/lib/bonuses'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const lessonSlug = params?.lesson as string
  // const sectionSlug = params?.section as string
  const module = await getBonus(params?.module as string)

  // const currentLessonSection = module.sections.find((section: any) => {
  //   return section.lessons.find((lesson: any) => lesson.slug === lessonSlug)
  // })
  // const section = await getSection(sectionSlug || currentLessonSection?.slug)
  const lesson = await getExercise(lessonSlug, false)
  // if sectionSlug does not exist in url but is still present in data structure, we need to get current lesson by filtering through all sections

  const moduleWithSectionsAndLessons = {
    ...module,
    useResourcesInsteadOfSections: true,
  }
  if (!lesson) {
    const msg = `Unable to find Exercise for slug (${lessonSlug}). Context: module (${params?.module})`
    Sentry.captureMessage(msg)

    return {
      notFound: true,
    }
  }

  const lessonBodySerialized =
    typeof lesson.body === 'string' &&
    (await serialize(lesson.body, {
      mdxOptions: {
        rehypePlugins: [trimCodeBlocks, removePreContainerDivs],
      },
    }))

  return {
    props: {
      lesson,
      lessonBodySerialized,
      lessonBodyPreviewSerialized: lessonBodySerialized,
      module: moduleWithSectionsAndLessons,
      // section,
      transcript: lesson.transcript,
      videoResourceId: lesson.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const bonuses = await getAllBonuses()

  const paths = bonuses.flatMap((bonus: Bonus) => {
    return (
      bonus.resources?.map((resource: any) => {
        return {
          params: {
            module: bonus.slug.current,
            lesson: resource.slug,
          },
        }
      }) || []
    )
  })

  return {paths, fallback: 'blocking'}
}

const BonusLessonPage: React.FC<any> = ({
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
          <ExerciseTemplate
            transcript={transcript}
            lessonBodySerialized={lessonBodySerialized}
            lessonBodyPreviewSerialized={lessonBodyPreviewSerialized}
            lessonPathBuilder={lessonPathBuilder}
          />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default BonusLessonPage
