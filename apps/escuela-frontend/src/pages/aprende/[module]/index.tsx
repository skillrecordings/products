import React from 'react'
import {SanityDocument} from '@sanity/client'
import {getAllCourses, getModule} from 'lib/courses'
import {GetStaticPaths, GetStaticProps} from 'next'
import CourseTemplate from 'templates/course-template'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const course = await getModule(params?.module as string)

  return {
    props: {course},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = await getAllCourses()
  const paths = courses.map((course: any) => ({
    params: {module: course.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const CoursePage: React.FC<{
  course: SanityDocument
}> = ({course}) => {
  return <CourseTemplate course={course} />
}

export default CoursePage
