import React from 'react'

import {User} from '@skillrecordings/database'
import Layout from 'components/layout'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllLessons, getLesson} from 'lib/lessons'
import {getPlaylist} from 'lib/playlists'
import {LessonResource} from '@skillrecordings/types'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import LessonTemplate from 'templates/lesson-template'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const lesson = await getLesson(params?.lesson as string)
  const module = await getPlaylist(lesson.module.module.slug.current as string)
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
    _type: string
  }
  module: Module
  videoResourceId: string
}> = ({lesson, module, videoResourceId}) => {
  return (
    <Layout>
      <LessonProvider lesson={lesson} module={module}>
        <VideoResourceProvider videoResourceId={videoResourceId}>
          <LessonTemplate />
        </VideoResourceProvider>
      </LessonProvider>
    </Layout>
  )
}

export default LessonPage
