import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {getAllBonuses, getBonus, type Bonus} from '@/lib/bonuses'
import BonusTemplate from '@/templates/bonus-template'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const bonus = await getBonus(params?.module as string)

  const moduleWithSectionsAndLessons = {
    ...bonus,
    useResourcesInsteadOfSections: true,
  }

  const bonusBodySerialized = bonus?.body
    ? await serializeMDX(bonus.body)
    : null

  return {
    props: {bonus: moduleWithSectionsAndLessons, bonusBodySerialized},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const bonuses = await getAllBonuses()
  const paths = bonuses.map((bonus: Bonus) => ({
    params: {module: bonus.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const BonusPage: React.FC<{
  bonus: Bonus
  bonusBodySerialized: MDXRemoteSerializeResult
}> = ({bonus, bonusBodySerialized}) => {
  return (
    <ModuleProgressProvider moduleSlug={bonus.slug.current}>
      <BonusTemplate bonus={bonus} bonusBodySerialized={bonusBodySerialized} />
    </ModuleProgressProvider>
  )
}

export default BonusPage
