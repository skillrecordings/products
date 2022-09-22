import React from 'react'
import {GetServerSideProps} from 'next'
import {getAllTips, getTip, Tip} from 'lib/tips'
import TipTemplate from 'templates/tip-template'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  params,
  req,
}) => {
  const tip = await getTip(params?.tip as string)
  const tips = await getAllTips()

  if (!tip) {
    return {
      notFound: true,
    }
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  return {
    props: {
      tip,
      tips,
    },
  }
}

export type TipPageProps = {
  tip: Tip
  tips: Tip[]
}

const TipPage: React.FC<TipPageProps> = ({tip, tips}) => {
  return tip ? <TipTemplate tip={tip} tips={tips} /> : null
}

export default TipPage
