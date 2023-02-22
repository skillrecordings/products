import S from '@sanity/desk-tool/structure-builder'
import {MdFeaturedPlayList} from 'react-icons/md'

const playlists = S.listItem()
  .title('Playlists')
  .icon(MdFeaturedPlayList)
  .child(
    S.documentTypeList('module')
      .filter('moduleType == "playlist"')
      .title('All Playlists'),
  )

export default playlists
