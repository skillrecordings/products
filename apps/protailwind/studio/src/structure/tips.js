import S from '@sanity/desk-tool/structure-builder'
import {GoFlame} from 'react-icons/go'

const tips = S.listItem()
  .title('Tips')
  .icon(GoFlame)
  .child(S.documentTypeList('tip').title('All Tips'))

export default tips
