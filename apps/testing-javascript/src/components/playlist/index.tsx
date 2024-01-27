import * as React from 'react'
import {SanityDocument} from '@sanity/client'
import PlaylistItem from '@/components/playlist/playlist-item'
import {ModuleProgressProvider} from '@/utils/module-progress'

const Playlist: React.FC<{
  playlist: SanityDocument
  purchased: boolean
}> = ({playlist, purchased}) => {
  return (
    <ModuleProgressProvider moduleSlug={playlist.slug.current as string}>
      <PlaylistItem
        key={playlist._id}
        playlist={playlist}
        purchased={purchased}
      />
    </ModuleProgressProvider>
  )
}

export default Playlist
