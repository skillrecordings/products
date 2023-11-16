import React from 'react'
import Layout from 'components/layout'
import {GetStaticPaths, GetStaticProps} from 'next'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import InterviewTemplate from 'templates/interview-template'
import {
  getAllInterviews,
  getInterview,
  getInterviewModule,
} from 'lib/interviews'
import {z} from 'zod'
import type {Module} from '@skillrecordings/skill-lesson/schemas/module'
import type {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const interviewSlug = params?.interview as string
  const lesson: Lesson = await getInterview(interviewSlug)
  const module: Module = await getInterviewModule()

  return {
    props: {lesson, module, videoResourceId: lesson.videoResourceId},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const interviews = z
    .array(z.object({slug: z.object({current: z.string()})}))
    .parse(await getAllInterviews())
  const paths = interviews.map((interview) => {
    return {
      params: {interview: interview.slug.current},
    }
  })
  return {paths, fallback: 'blocking'}
}

const InterviewPage: React.FC<{
  lesson: Lesson
  module: Module
  videoResourceId: string
}> = ({lesson, module, videoResourceId}) => {
  const ogImage = undefined
  //   const ogImage = {
  //     url: `${process.env.NEXT_PUBLIC_URL}${
  //       process.env.NEXT_PUBLIC_OG_IMAGE_MODULE_API_URL
  //     }?type=lesson&image=${encodeURI(module.image as string)}&title=${encodeURI(
  //       lesson.title,
  //     )}`,
  //     alt: 'lesson image',
  //   }

  return (
    <Layout meta={{ogImage, title: lesson.title}}>
      <LessonProvider module={module} lesson={lesson}>
        <VideoResourceProvider videoResourceId={videoResourceId}>
          <InterviewTemplate interview={lesson} />
        </VideoResourceProvider>
      </LessonProvider>
    </Layout>
  )
}

export default InterviewPage
