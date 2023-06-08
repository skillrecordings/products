import React from 'react'

import {GetStaticPaths, GetStaticProps} from 'next'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {getAllBonuses, getBonus} from '../../../lib/bonuses'
import BonusTemplate from '../../../templates/bonus-template'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const bonus = await getBonus(params?.module as string)
  const bonusBodySerialized = await serializeMDX(bonus.body)

  return {
    props: {bonus, bonusBodySerialized},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const bonuses = await getAllBonuses()
  const paths = bonuses.map((bonus: any) => ({
    params: {module: bonus.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const PlaylistPage: React.FC<{
  bonus: Module
  bonusBodySerialized: MDXRemoteSerializeResult
}> = ({bonus, bonusBodySerialized}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return (
    <ModuleProgressProvider moduleSlug={bonus.slug.current}>
      <BonusTemplate bonus={bonus} bonusBodySerialized={bonusBodySerialized} />
    </ModuleProgressProvider>
  )
}

export default PlaylistPage
