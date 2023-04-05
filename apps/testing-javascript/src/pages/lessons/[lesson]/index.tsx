import React from 'react'

import {User} from '@skillrecordings/database'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllLessons, getLesson} from '../../../lib/lessons'
import {LessonResource} from '@skillrecordings/types'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const lesson = await getLesson(params?.lesson as string)

  return {
    props: {lesson},
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
  lesson: LessonResource
}> = ({lesson}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return (
    <div>
      <h1>{lesson.title}</h1>
    </div>
  )
}

export default LessonPage
