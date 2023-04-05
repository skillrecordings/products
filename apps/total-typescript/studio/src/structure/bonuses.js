import S from '@sanity/desk-tool/structure-builder'
import {MdFeaturedPlayList} from 'react-icons/md'

const bonuses = S.listItem()
  .title('Playlists')
  .icon(MdFeaturedPlayList)
  .child(
    S.documentTypeList('module')
      .filter('moduleType == "bonus"')
      .title('All Bonuses'),
  )

export default bonuses
