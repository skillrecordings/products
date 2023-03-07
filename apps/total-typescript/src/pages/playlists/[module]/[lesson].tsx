import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getExercise} from 'lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from 'video/module-progress'
import {getAllPlaylists, getPlaylist} from 'lib/playlists'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.lesson as string

  const module = await getPlaylist(params?.module as string)
  const lesson = await getExercise(exerciseSlug)

  return {
    props: {
      lesson,
      module,
      transcript: lesson.transcript,
      videoResourceId: lesson.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllPlaylists()

  const paths = tutorials.reduce((acc: any[], tutorial: any) => {
    return [
      ...acc,
      ...tutorial.lessons.map((exercise: any) => {
        return {
          params: {
            module: tutorial.slug.current,
            lesson: exercise.slug,
          },
        }
      }),
    ]
  }, [])

  return {paths, fallback: 'blocking'}
}

const VideoPage: React.FC<any> = ({
  lesson,
  module,
  transcript,
  videoResourceId,
}) => {
  return (
    <ModuleProgressProvider moduleSlug={module.slug.current}>
      <LessonProvider lesson={lesson} module={module}>
        <VideoResourceProvider
          videoResourceId={videoResourceId}
          module={module}
        >
          <ExerciseTemplate transcript={transcript} />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default VideoPage
