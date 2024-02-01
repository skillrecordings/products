import {VscGroupByRefType} from 'react-icons/vsc'

const products = (S) =>
  S.listItem()
    .title('Seasons')
    .icon(VscGroupByRefType)
    .child(S.documentTypeList('podcastSeason').title('All Seasons'))

export default products
