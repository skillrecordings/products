import React from 'react'

import {type User} from '@skillrecordings/database'
import Layout from '@/components/layout'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllLessons, getLesson} from '@/lib/lessons'
import {getPlaylist} from '@/lib/playlists'
import {type LessonResource} from '@skillrecordings/types'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import LessonTemplate from '@/templates/lesson-template'
import {type Section} from '@skillrecordings/skill-lesson/schemas/section'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const lesson = await getLesson(params?.lesson as string)
  const module = await getPlaylist(lesson.module.slug.current as string)
  return {
    props: {module, lesson, videoResourceId: lesson.videoResourceId},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const lessons = await getAllLessons()
  const paths = lessons.map((lesson: any) => {
    return {
      params: {lesson: lesson.slug},
    }
  })
  return {paths, fallback: 'blocking'}
}

const LessonPage: React.FC<{
  lesson: LessonResource & {
    _id: string
    _type: string
    section: Section
  }
  module: Module
  videoResourceId: string
}> = ({lesson, module, videoResourceId}) => {
  const ogImage = {
    url: `${process.env.NEXT_PUBLIC_URL}${
      process.env.NEXT_PUBLIC_OG_IMAGE_MODULE_API_URL
    }?type=lesson&image=${encodeURI(module.image as string)}&title=${encodeURI(
      lesson.title,
    )}`,
    alt: 'lesson image',
  }
  return (
    <Layout meta={{ogImage, title: lesson.title}}>
      <LessonProvider lesson={lesson} module={module} section={lesson.section}>
        <VideoResourceProvider videoResourceId={videoResourceId}>
          <LessonTemplate />
        </VideoResourceProvider>
      </LessonProvider>
    </Layout>
  )
}

export default LessonPage
