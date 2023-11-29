import React from 'react'
import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import {getAllTips, getTip, type Tip} from '@/lib/tips'
import TipTemplate from '@/templates/tip-template'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const tip = await getTip(params?.tip as string)
  const tips = await getAllTips()

  if (!tip) {
    return {
      notFound: true,
    }
  }

  const tipBodySerialized =
    tip.body &&
    (await serializeMDX(tip.body, {
      syntaxHighlighterOptions: {
        theme: 'dark-plus',
      },
    }))
  const tipSummarySerialized =
    tip.summary &&
    (await serializeMDX(tip.summary, {
      syntaxHighlighterOptions: {
        theme: 'dark-plus',
      },
    }))

  return {
    props: {
      tip,
      tipBodySerialized,
      tipSummarySerialized,
      tips,
      videoResourceId: tip.videoResourceId,
      transcript: tip.transcript,
    },
    revalidate: 10,
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
  videoResourceId: string
  transcript: string
  tipBodySerialized: MDXRemoteSerializeResult
  tipSummarySerialized: MDXRemoteSerializeResult
}

const TipPage: NextPage<TipPageProps> = ({
  tip,
  tips,
  videoResourceId,
  transcript,
  tipBodySerialized,
  tipSummarySerialized,
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
          tipBodySerialized={tipBodySerialized}
          tipSummarySerialized={tipSummarySerialized}
        />
      </VideoResourceProvider>
    </LessonProvider>
  )
}

export default TipPage
