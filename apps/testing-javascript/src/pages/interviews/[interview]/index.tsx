import React from 'react'
import Layout from 'components/layout'
import {GetStaticPaths, GetStaticProps} from 'next'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import InterviewTemplate from 'templates/interview-template'
import {getAllInterviews, getInterview} from 'lib/interviews'
import {z} from 'zod'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const interviewSlug = params?.interview as string
  const interview = await getInterview(interviewSlug)
  //   const lesson = await getLesson(params?.lesson as string)
  //   const module = await getPlaylist(lesson.module.slug.current as string)
  return {
    props: {interview, videoResourceId: interview.videoResource._id},
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
  interview: {title: string; slug: {current: string}}
  videoResourceId: string
}> = ({interview, videoResourceId}) => {
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
    <Layout meta={{ogImage, title: interview.title}}>
      <VideoResourceProvider videoResourceId={videoResourceId}>
        <InterviewTemplate interview={interview} />
      </VideoResourceProvider>
    </Layout>
  )
}

export default InterviewPage
