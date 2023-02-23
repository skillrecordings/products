import React from 'react'

import {GetStaticPaths, GetStaticProps} from 'next'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {ModuleProgressProvider} from 'video/module-progress'
import {getAllPlaylists, getPlaylist} from '../../../lib/playlists'
import PlaylistTemplate from '../../../templates/playlist-template'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const playlist = await getPlaylist(params?.module as string)

  return {
    props: {playlist},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const playlists = await getAllPlaylists()
  const paths = playlists.map((playlist: any) => ({
    params: {module: playlist.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const PlaylistPage: React.FC<{
  playlist: Module
}> = ({playlist}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return (
    <ModuleProgressProvider moduleSlug={playlist.slug.current}>
      <PlaylistTemplate playlist={playlist} />
    </ModuleProgressProvider>
  )
}

export default PlaylistPage
