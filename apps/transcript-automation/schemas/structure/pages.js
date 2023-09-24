import {HiHome} from 'react-icons/hi'

const pages = (S) =>
  S.listItem()
    .title('Pages')
    .icon(HiHome)
    .child(S.documentTypeList('page').title('All Pages'))

export default pages
