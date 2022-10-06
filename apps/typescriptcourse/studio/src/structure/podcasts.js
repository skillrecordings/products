import S from '@sanity/desk-tool/structure-builder'
import {FaPodcast} from 'react-icons/fa'

const products = S.listItem()
  .title('Podcast')
  .icon(FaPodcast)
  .child(S.documentTypeList('podcast').title('All Shows'))

export default products
