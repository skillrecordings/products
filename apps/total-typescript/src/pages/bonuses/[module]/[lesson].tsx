import React from 'react'
import ExerciseTemplate from '@/templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getExercise} from '@/lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {getAllBonuses, getBonus} from '@/lib/bonuses'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.lesson as string

  const module = await getBonus(params?.module as string)
  const lesson = await getExercise(exerciseSlug)

  if (!lesson) {
    return {
      notFound: true,
    }
  }

  const lessonBodySerialized =
    typeof lesson.body === 'string' &&
    (await serializeMDX(lesson.body, {
      syntaxHighlighterOptions: {
        theme: 'dark-plus',
        showCopyButton: true,
      },
    }))
  const lessonBodyPreviewSerialized =
    typeof lesson.body === 'string' &&
    (await serializeMDX(lesson.body.substring(0, 300), {
      syntaxHighlighterOptions: {
        theme: 'dark-plus',
      },
    }))

  return {
    props: {
      lesson,
      lessonBodySerialized,
      lessonBodyPreviewSerialized,
      module,
      transcript: lesson.transcript,
      videoResourceId: lesson.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllBonuses()

  const paths = tutorials.reduce((acc: any[], tutorial: any) => {
    return [
      ...acc,
      ...tutorial.lessons.map((exercise: any) => {
        return {
          params: {
            module: tutorial.slug.current,
            lesson: exercise.slug,
          },
        }
      }),
    ]
  }, [])

  return {paths, fallback: 'blocking'}
}

const VideoPage: React.FC<any> = ({
  lesson,
  lessonBodySerialized,
  lessonBodyPreviewSerialized,
  module,
  transcript,
  videoResourceId,
}) => {
  return (
    <ModuleProgressProvider moduleSlug={module.slug.current}>
      <LessonProvider lesson={lesson} module={module}>
        <VideoResourceProvider videoResourceId={videoResourceId}>
          <ExerciseTemplate
            transcript={transcript}
            lessonBodySerialized={lessonBodySerialized}
            lessonBodyPreviewSerialized={lessonBodyPreviewSerialized}
          />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default VideoPage
