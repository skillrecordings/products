import React from 'react'

import {GetStaticPaths, GetStaticProps} from 'next'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {ModuleProgressProvider} from 'video/module-progress'
import {getAllBonuses, getBonus} from '../../../lib/bonuses'
import BonusTemplate from '../../../templates/bonus-template'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const bonus = await getBonus(params?.module as string)

  return {
    props: {bonus},
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
}> = ({bonus}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return (
    <ModuleProgressProvider moduleSlug={bonus.slug.current}>
      <BonusTemplate bonus={bonus} />
    </ModuleProgressProvider>
  )
}

export default PlaylistPage
