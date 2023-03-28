import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {
  getAllWorkshops,
  getLessonBySlug,
  getWorkshopBySlug,
} from '../../../lib/resources'
import {ModuleProgressProvider} from 'utils/module-progress'

import LessonTemplate from 'templates/lesson-template'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const lessonSlug = params?.lesson as string
  const module = await getWorkshopBySlug(params?.module as string)
  const lesson = await getLessonBySlug(lessonSlug)

  return {
    props: {
      lesson,
      module,
      videoResourceId: lesson.videoResourceId,
      transcript: lesson.transcript,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const workshops = await getAllWorkshops()

  // flatMap to extract lessons in sections from workshops
  const paths = workshops.flatMap((workshop: any) => {
    return (
      workshop.lessons?.map((lesson: any) => ({
        params: {
          module: workshop.slug,
          lesson: lesson.slug,
        },
      })) || []
    )
  })

  return {paths, fallback: 'blocking'}
}

const LessonPage: React.FC<any> = ({
  lesson,
  module,
  videoResourceId,
  transcript,
}) => {
  console.log({videoResourceId})
  return (
    // <ModuleProgressProvider moduleSlug={module.slug.current}>
    //   <LessonProvider lesson={lesson} module={module}>
    //     <VideoResourceProvider videoResourceId={videoResourceId}>
    <LessonTemplate transcript={transcript} lesson={lesson} module={module} />
    //     </VideoResourceProvider>
    //   </LessonProvider>
    // </ModuleProgressProvider>
  )
}

export default LessonPage
