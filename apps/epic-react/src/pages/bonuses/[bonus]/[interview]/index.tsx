import React from 'react'
import LessonTemplate from '@/templates/lesson-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getExercise} from '@/lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {getSection} from '@/lib/sections'
import {getWorkshop} from '@/lib/workshops'
import {getAllBonuses, getBonus} from '@/lib/bonuses'
import {serialize} from 'next-mdx-remote/serialize'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const interviewSlug = params?.interview as string
  const bonusSlug = params?.bonus as string
  const bonus = await getBonus(bonusSlug)

  const moduleWithSectionsAndLessons = {
    ...bonus,
    useResourcesInsteadOfSections: true,
  }

  const lesson = await getExercise(interviewSlug, false)
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
      transcript: lesson.transcript,
      videoResourceId: lesson.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const bonuses = await getAllBonuses()
  const interviews = bonuses[0]

  console.log({bonuses, lessons: bonuses[0].lessons})

  const paths =
    interviews.lessons.map((interview: any) => {
      return {
        params: {
          bonus: interviews.slug.current,
          interview: interview.slug,
        },
      }
    }) || []

  return {paths, fallback: 'blocking'}
}

const InterviewPage: React.FC<any> = ({
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

export default InterviewPage
