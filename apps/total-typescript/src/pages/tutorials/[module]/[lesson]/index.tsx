import React from 'react'
import LessonTemplate from 'templates/lesson-template'
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

  const tutorial = await getTutorial(params?.module as string)

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
    <LessonTemplate lesson={lesson} module={tutorial} subscriber={subscriber} />
  )
}

export default LessonPage
