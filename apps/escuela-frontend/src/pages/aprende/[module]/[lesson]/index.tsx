import React from 'react'
import {SanityDocument} from '@sanity/client'
import {getAllCourses, getModule} from 'lib/courses'
import {GetStaticPaths, GetStaticProps} from 'next'
import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import Link from 'next/link'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const course = await getModule(params?.module as string)
  const lesson = await getModule(params?.lesson as string)

  return {
    props: {course, lesson},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = await getAllCourses()
  const paths = courses.map((course: any) => ({
    params: {module: course.slug.current, lesson: course.slug.current},
  }))
  // const paths = courses.map((course: any) => {
  //   return [
  //     modules.lessons.map((lesson: any) => {
  //       return {
  //         params: {
  //           module: course.slug.current,
  //           exercise: lesson.lessonSlug,
  //         },
  //       }
  //     }),
  //   ]
  // }, [])
  return {paths, fallback: 'blocking'}
}

const LessonPage: React.FC<{
  course: SanityDocument
}> = ({course}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY

  return (
    <>
      <div>Holaaa</div>
    </>
  )
}

export default LessonPage
