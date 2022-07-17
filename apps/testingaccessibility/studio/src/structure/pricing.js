import S from '@sanity/desk-tool/structure-builder'
import {FcMoneyTransfer} from 'react-icons/fc'

const pricing = S.listItem()
  .title('Pricing')
  .icon(FcMoneyTransfer)
  .child(S.documentTypeList('pricing').title('Configure Pricing'))

export default pricing
