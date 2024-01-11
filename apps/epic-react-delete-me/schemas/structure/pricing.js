import {IoMdCash} from 'react-icons/io'

const pricing = (S) =>
  S.listItem()
    .title('Pricing')
    .icon(IoMdCash)
    .child(S.documentTypeList('pricing').title('Configure Pricing'))

export default pricing
