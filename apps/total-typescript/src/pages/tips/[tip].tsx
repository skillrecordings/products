import React from 'react'
import {GetServerSideProps} from 'next'
import {getTip, Tip} from 'lib/tips'
import TipTemplate from 'templates/tip-template'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  params,
  req,
}) => {
  const tip = await getTip(params?.tip as string)

  if (!tip) {
    return {
      notFound: true,
    }
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  return {
    props: {
      tip,
    },
  }
}

export type TipPageProps = {
  tip: Tip
}

const TipPage: React.FC<TipPageProps> = ({tip}) => {
  return tip ? <TipTemplate tip={tip} /> : null
}

export default TipPage
