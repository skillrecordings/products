import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {type Workshop} from 'lib/workshops'
import WorkshopTemplate from 'templates/workshop-template'
import {getAllBonuses, getBonus} from 'lib/bonuses'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const bonus = await getBonus(params?.module as string)
  const bonusBodySerialized = bonus.body ? await serializeMDX(bonus.body) : null

  return {
    props: {bonus, bonusBodySerialized},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const bonuses = await getAllBonuses()
  const paths = bonuses.map((bonus: Module) => ({
    params: {module: bonus.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const BonusPage: React.FC<{
  bonus: Module
  bonusBodySerialized: MDXRemoteSerializeResult
}> = ({bonus, bonusBodySerialized}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return (
    <ModuleProgressProvider moduleSlug={bonus.slug.current}>
      <WorkshopTemplate
        workshop={bonus as Workshop}
        workshopBodySerialized={bonusBodySerialized}
      />
    </ModuleProgressProvider>
  )
}

export default BonusPage
