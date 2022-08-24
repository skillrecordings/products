import {getCourse} from 'lib/courses'
import {GetServerSideProps} from 'next'
import React from 'react'
import CourseTemplate from 'templates/course-template'

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const course = await getCourse(params?.course as string)
  if (!course) {
    return {
      notFound: true,
    }
  }

  return {
    props: {course},
  }
}

const CoursePage: React.FC<any> = ({course}) => {
  return <CourseTemplate course={course} />
}

export default CoursePage
