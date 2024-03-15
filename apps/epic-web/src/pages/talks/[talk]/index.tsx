import React from 'react'
import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import {getAllTalks, getTalk, Talk} from 'lib/talks'
import TipTemplate from 'templates/tip-template'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import TalkTemplate from 'templates/talk-template'

export const getStaticProps: GetStaticProps = async ({params}) => {
  try {
    const talk = await getTalk(params?.talk as string)
    const talkBodySerialized =
      talk.body &&
      (await serializeMDX(talk.body, {
        syntaxHighlighterOptions: {
          // theme: 'material-theme-palenight',
          showCopyButton: true,
        },
      }))
    const talks = await getAllTalks(false)

    return {
      props: {
        talk,
        talkBodySerialized,
        talks,
        transcript: talk.transcript,
        videoResourceId: talk.videoResourceId,
      },
      revalidate: 10,
    }
  } catch (error) {
    console.error(error)
    return {
      notFound: true,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const talks = await getAllTalks()
  const paths = talks.map((talk) => ({
    params: {talk: talk.slug},
  }))
  return {paths, fallback: 'blocking'}
}

export type TalkPageProps = {
  talk: Talk
  talkBodySerialized: MDXRemoteSerializeResult
  talks: Talk[]
  transcript: string
  videoResourceId: string
}

const TalkPage: NextPage<TalkPageProps> = ({
  talk,
  talkBodySerialized,
  talks,
  transcript,
  videoResourceId,
}) => {
  const module: any = {
    slug: {
      current: 'talks',
    },
    moduleType: 'talk',
    lessons: talks,
    resources: talks?.filter(
      (talkToCompare) => talkToCompare.slug !== talk.slug,
    ),
  }

  return (
    <LessonProvider lesson={talk} module={module}>
      <VideoResourceProvider videoResourceId={videoResourceId}>
        <TalkTemplate
          talk={talk}
          talkBodySerialized={talkBodySerialized}
          talks={talks}
          transcript={transcript}
        />
      </VideoResourceProvider>
    </LessonProvider>
  )
}

export default TalkPage
