import {MdEmail} from 'react-icons/md'

const emails = (S) =>
  S.listItem()
    .title('Emails')
    .icon(MdEmail)
    .child(S.documentTypeList('mail').title('All Emails'))

export default emails
