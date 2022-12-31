import React from 'react'
import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import {getAllTips, getTip, Tip} from 'lib/tips'
import TipTemplate from 'templates/tip-template'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const tip = await getTip(params?.tip as string)
  const tips = await getAllTips()

  return {
    props: {
      tip,
      tips,
      videoResourceId: tip.videoResourceId,
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
}

const TipPage: NextPage<TipPageProps> = ({tip, tips, videoResourceId}) => {
  const module: any = {
    slug: {
      current: 'tips',
    },
    moduleType: 'tip',
    exercises: tips,
    resources: tips.filter((tipToCompare) => tipToCompare.slug !== tip.slug),
  }
  return (
    <LessonProvider lesson={tip} module={module}>
      <VideoResourceProvider videoResourceId={videoResourceId}>
        <TipTemplate tip={tip} tips={tips} />
      </VideoResourceProvider>
    </LessonProvider>
  )
}

export default TipPage
