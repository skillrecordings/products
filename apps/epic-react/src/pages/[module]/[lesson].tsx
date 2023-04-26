import React from 'react'
import Layout from 'components/layout'
import {GetServerSideProps, InferGetServerSidePropsType} from 'next'
import {z} from 'zod'
import {getLesson, LessonSchema} from 'lib/lessons'
import {getModule, ModuleSchema} from 'lib/modules'
import {
  VideoResourceProvider,
  useVideoResource,
} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'

const LessonPropsSchema = z.object({
  lesson: LessonSchema,
  module: ModuleSchema,
})
type LessonProps = z.infer<typeof LessonPropsSchema>

const LessonPageParamsSchema = z
  .object({
    lesson: z.string(),
    module: z.string(),
  })
  .transform(({lesson, module}) => {
    return {lessonSlug: lesson, moduleSlug: module}
  })

export const getServerSideProps: GetServerSideProps<LessonProps> = async ({
  params,
}) => {
  const {lessonSlug, moduleSlug} = LessonPageParamsSchema.parse(params)

  const module = await getModule(moduleSlug)
  const lesson = await getLesson(lessonSlug)

  return {
    props: {
      lesson,
      module,
    },
  }
}

const Lesson = ({
  lesson,
  module,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log({body: lesson.body})

  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <div className="max-w-screen-sm text-center font-light">
          <h1 className="font-heading py-8 text-4xl font-bold lg:text-5xl">
            {lesson.title}
          </h1>
          <h2 className="font-heading py-4 text-4xl font-bold lg:text-3xl">
            {module.title}
          </h2>
          <p className="mx-auto pb-8 leading-relaxed sm:text-xl">
            Description: {lesson.description}
          </p>
          <LessonProvider lesson={lesson} module={module}>
            <VideoResourceProvider videoResourceId={lesson.videoResourceId}>
              <LessonTemplate transcript={lesson.transcript} />
            </VideoResourceProvider>
          </LessonProvider>
        </div>
      </main>
    </Layout>
  )
}

const LessonTemplate = ({transcript}: {transcript: any[]}) => {
  const {videoResourceId, videoResource} = useVideoResource()

  return (
    <div>
      <p>Video Resource ID: {videoResourceId}</p>
      <p>Render video here...</p>
      <div className="relative flex-grow 2xl:block 2xl:bg-black/20">
        <VideoTranscript transcript={transcript} />
      </div>
    </div>
  )
}

export default Lesson
