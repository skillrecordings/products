import React from 'react'
import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import {getAllTips, getTip, Tip} from 'lib/tips'
import TipTemplate from 'templates/tip-template'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {serialize} from 'next-mdx-remote/serialize'

export const getStaticProps: GetStaticProps = async ({params}) => {
  try {
    const tip = await getTip(params?.tip as string)
    const tips = await getAllTips()
    const mdxSourceBody = await serialize(tip.body)
    const mdxSourceTranscript = await serialize(tip.transcript)

    return {
      props: {
        tip,
        tips,
        transcript: mdxSourceTranscript,
        videoResourceId: tip.videoResourceId,
        source: mdxSourceBody,
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
  const tips = await getAllTips()
  const paths = tips.map((tip) => ({
    params: {tip: tip.slug},
  }))
  return {paths, fallback: 'blocking'}
}

export type TipPageProps = {
  tip: Tip
  tips: Tip[]
  transcript: any
  videoResourceId: string
  source: any
}

const TipPage: NextPage<TipPageProps> = ({
  tip,
  tips,
  transcript,
  videoResourceId,
  source,
}) => {
  const module: any = {
    slug: {
      current: 'tips',
    },
    moduleType: 'tip',
    lessons: tips,
    resources: tips.filter((tipToCompare) => tipToCompare.slug !== tip.slug),
  }

  return (
    <LessonProvider lesson={tip} module={module}>
      <VideoResourceProvider videoResourceId={videoResourceId}>
        <TipTemplate
          tip={tip}
          tips={tips}
          transcript={transcript}
          source={source}
        />
      </VideoResourceProvider>
    </LessonProvider>
  )
}

export default TipPage
