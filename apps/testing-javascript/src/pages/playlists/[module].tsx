import * as React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'

import {getPlaylist, getAllPlaylists} from '@/lib/playlists'
import {ModuleProgressProvider} from '@/utils/module-progress'
import WorkshopTemplate from '@/templates/workshop-template'
import {Module} from '@/@types/'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const workshop = await getPlaylist(params?.module as string)

  return {
    props: {workshop},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const workshops = await getAllPlaylists()
  const paths = workshops.map((workshop: any) => {
    return {
      params: {module: workshop.slug.current},
    }
  })
  return {paths, fallback: 'blocking'}
}

const WorkshopPage: React.FC<{
  workshop: Module
}> = ({workshop}) => {
  return (
    <ModuleProgressProvider moduleSlug={workshop.slug.current as string}>
      <WorkshopTemplate workshop={workshop} />
    </ModuleProgressProvider>
  )
}

export default WorkshopPage
