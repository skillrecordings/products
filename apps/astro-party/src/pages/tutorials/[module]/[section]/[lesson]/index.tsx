import React from 'react'
import LessonTemplate from 'templates/lesson-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {getExercise} from 'lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {getSection} from 'lib/sections'
import {serialize} from 'next-mdx-remote/serialize'
import {Resource} from '@skillrecordings/skill-lesson/schemas/resource'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const lessonSlug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getTutorial(params?.module as string)
  const section = await getSection(sectionSlug)
  const lesson = await getExercise(lessonSlug, false)
  const lessonBody = lesson.body && (await serialize(String(lesson.body)))
  const lessonBodyPreview =
    lesson.body && (await serialize(String(lesson.body).substring(0, 300)))

  return {
    props: {
      lesson,
      lessonBody,
      lessonBodyPreview,
      module,
      section,
      transcript: lesson.transcript,
      videoResourceId: lesson.videoResourceId,
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

type LessonPageProps = {
  lesson: Resource
  lessonBody: MDXRemoteSerializeResult
  lessonBodyPreview: MDXRemoteSerializeResult
  module: Module
  section: Section
  transcript: string
  videoResourceId: string
}

const LessonPage: React.FC<LessonPageProps> = ({
  lesson,
  lessonBody,
  lessonBodyPreview,
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
            lessonBody={lessonBody}
            lessonBodyPreview={lessonBodyPreview}
          />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default LessonPage
