import React from 'react'
import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import {getAllTips, getTip, Tip} from 'lib/tips'
import TipTemplate from 'templates/tip-template'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const tip = await getTip(params?.tip as string)
  const tips = await getAllTips()

  return {
    props: {
      tip,
      tips,
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
}

const TipPage: NextPage<TipPageProps> = ({tip, tips}) => {
  return <TipTemplate tip={tip} tips={tips} />
}

export default TipPage
