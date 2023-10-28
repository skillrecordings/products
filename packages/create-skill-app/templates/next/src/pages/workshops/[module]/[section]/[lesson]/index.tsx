import React from 'react'
import LessonTemplate from '@/templates/lesson-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getExercise} from '@/lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {getSection} from '@/lib/sections'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {getAllWorkshops, getWorkshop} from '@/lib/workshops'
import {serialize} from 'next-mdx-remote/serialize'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const lessonSlug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getWorkshop(params?.module as string)
  const section = await getSection(sectionSlug)
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
      module,
      section,
      transcript: lesson.transcript,
      videoResourceId: lesson.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllWorkshops()

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
