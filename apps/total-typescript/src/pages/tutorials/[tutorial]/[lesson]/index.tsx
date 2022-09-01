import React from 'react'
import LessonTemplate from 'templates/lesson-template'
import {VideoProvider} from 'context/video-context'
import {GetServerSideProps} from 'next'
import {getTutorial} from 'lib/tutorials'
import {getBlockedLesson, getLesson} from 'lib/lessons'
import {checkIfConvertkitSubscriber} from '@skillrecordings/convertkit'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {params} = context
  const lessonSlug = params?.lesson as string
  const subscriber = await checkIfConvertkitSubscriber(context)

  const blockedLesson = await getBlockedLesson(lessonSlug)

  if (!blockedLesson) {
    return {
      notFound: true,
    }
  }

  const tutorial = await getTutorial(params?.tutorial as string)

  if (blockedLesson.isFree || subscriber) {
    const fullLesson = await getLesson(lessonSlug)

    return {
      props: {lesson: fullLesson, tutorial},
    }
  }

  return {
    props: {lesson: blockedLesson, tutorial},
  }
}

const LessonPage: React.FC<any> = ({lesson, tutorial, subscriber}) => {
  return (
    <VideoProvider>
      <LessonTemplate
        lesson={lesson}
        module={tutorial}
        subscriber={subscriber}
      />
    </VideoProvider>
  )
}

export default LessonPage
