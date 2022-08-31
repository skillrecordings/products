import {VideoProvider} from 'context/video-context'
import {getBlockedLesson} from 'lib/lessons'
import {getTutorial} from 'lib/tutorials'
import {GetServerSideProps} from 'next'
import React from 'react'
import LessonTemplate from 'templates/lesson-template'

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const lesson = await getBlockedLesson(params?.lesson as string)

  if (!lesson) {
    return {
      notFound: true,
    }
  }

  const module = await getTutorial(params?.tutorial as string)

  return {
    props: {lesson, module},
  }
}

const LessonPage: React.FC<any> = ({lesson, module}) => {
  return (
    <VideoProvider>
      <LessonTemplate lesson={lesson} module={module} />
    </VideoProvider>
  )
}

export default LessonPage
