import {MdFeaturedPlayList} from 'react-icons/md'

const bonuses = (S) =>
  S.listItem()
    .title('Playlists')
    .icon(MdFeaturedPlayList)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "bonus"')
        .title('All Bonuses'),
    )

export default bonuses
