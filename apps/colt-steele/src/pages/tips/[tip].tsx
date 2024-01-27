import React from 'react'
import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import {getAllTips, getTip, Tip} from '@/lib/tips'
import TipTemplate from '@/templates/tip-template'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'

export const getStaticProps: GetStaticProps = async ({params}) => {
  try {
    const tip = await getTip(params?.tip as string)
    const tips = await getAllTips()

    const tipBody =
      tip.body &&
      (await serializeMDX(tip.body, {
        syntaxHighlighterOptions: {
          theme: 'light-plus',
          showCopyButton: true,
        },
      }))
    const tipSummary = tip.summary
      ? await serializeMDX(tip.summary, {
          syntaxHighlighterOptions: {
            theme: 'light-plus',
            showCopyButton: true,
          },
        })
      : null

    return {
      props: {
        tip,
        tips,
        tipBody,
        tipSummary,
        ...(tip.transcript && {transcript: tip.transcript}),
        videoResourceId: tip.videoResourceId,
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
  tipBody: MDXRemoteSerializeResult
  tipSummary: MDXRemoteSerializeResult
  transcript: any[]
  videoResourceId: string
}

const TipPage: NextPage<TipPageProps> = ({
  tip,
  tips,
  transcript,
  tipBody,
  tipSummary,
  videoResourceId,
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
          tipBody={tipBody}
          tipSummary={tipSummary}
          tips={tips}
          transcript={transcript}
        />
      </VideoResourceProvider>
    </LessonProvider>
  )
}

export default TipPage
