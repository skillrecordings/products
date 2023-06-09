import {MdLink} from 'react-icons/md'

const links = (S) =>
  S.listItem()
    .title('Link Resources')
    .icon(MdLink)
    .child(S.documentTypeList('linkResource').title('All Link Resources'))

export default links
