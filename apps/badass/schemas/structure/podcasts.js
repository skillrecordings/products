import {FaPodcast} from 'react-icons/fa'

const products = (S) =>
  S.listItem()
    .title('Podcasts')
    .icon(FaPodcast)
    .child(S.documentTypeList('podcast').title('All Podcasts'))

export default products
