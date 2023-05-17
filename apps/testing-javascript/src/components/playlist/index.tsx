import * as React from 'react'
import cx from 'classnames'
import Image from 'next/image'
import {SanityDocument} from '@sanity/client'
import Balancer from 'react-wrap-balancer'
import {PortableText} from '@portabletext/react'

import Icon from 'components/icons'
import PlaylisItem from 'components/playlist/playlist-item'
import {ModuleProgressProvider, useModuleProgress} from 'utils/module-progress'

const Playlist: React.FC<{
  playlist: SanityDocument
  purchased: boolean
}> = ({playlist, purchased}) => {
  return (
    <ModuleProgressProvider moduleSlug={playlist.slug.current as string}>
      <PlaylisItem
        key={playlist._id}
        playlist={playlist}
        purchased={purchased}
      />
    </ModuleProgressProvider>
  )
}

export default Playlist
