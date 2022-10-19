import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllCourses, getModule} from 'lib/courses'
import {getLesson} from 'lib/lessons'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const lessonSlug = params?.lesson as string

  const module = await getModule(params?.module as string)
  const lesson = await getLesson(lessonSlug)

  return {
    props: {lesson, module},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const courses = await getAllCourses()

  const paths = courses.reduce((acc: any[], course: any) => {
    return [
      ...acc,
      ...course.lessons.map((lesson: any) => {
        return {
          params: {
            module: course.slug.current,
            lesson: lesson.slug,
          },
        }
      }),
    ]
  }, [])
  return {paths, fallback: 'blocking'}
}

const LessonSolution: React.FC<any> = ({lesson, module}) => {
  return <h1>lol</h1>
}

export default LessonSolution
