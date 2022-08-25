import {VideoProvider} from 'context/video-context'
import {getCourse} from 'lib/courses'
import {getLesson} from 'lib/lessons'
import {GetServerSideProps} from 'next'
import React from 'react'
import LessonTemplate from 'templates/lesson-template'

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const lesson = await getLesson(params?.lesson as string)

  if (!lesson) {
    return {
      notFound: true,
    }
  }

  const course = await getCourse(params?.course as string)

  return {
    props: {lesson, course},
  }
}

const LessonPage: React.FC<any> = ({lesson, course}) => {
  return (
    <VideoProvider>
      <LessonTemplate lesson={lesson} course={course} />
    </VideoProvider>
  )
}

export default LessonPage
