import React from 'react'

import {User} from '@skillrecordings/database'
import {SanityDocument} from '@sanity/client'
import {getAllCourses, getModule} from 'lib/courses'
import {GetStaticPaths, GetStaticProps} from 'next'
import Image from 'next/image'
import {PortableText} from '@portabletext/react'

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
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY

  return (
    <>
      <div className="flex flex-col flex-grow w-full mx-auto mb-32">
        <div>YAYYYYY</div>
      </div>
    </>
  )
}

export default CoursePage
