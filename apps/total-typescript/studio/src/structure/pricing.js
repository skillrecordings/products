import S from '@sanity/desk-tool/structure-builder'
import {IoMdCash} from 'react-icons/io'
import {FiDollarSign} from 'react-icons/fi'

const pricing = S.listItem()
  .title('Pricing')
  .icon(IoMdCash)
  .child(S.documentTypeList('pricing').title('Configure Pricing'))

export default pricing
