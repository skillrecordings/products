import {MdCreditCard} from 'react-icons/md'

const pricing = (S) =>
  S.listItem()
    .title('Pricing')
    .icon(MdCreditCard)
    .child(S.documentTypeList('pricing').title('Configure Pricing'))

export default pricing
