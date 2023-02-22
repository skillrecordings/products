import S from '@sanity/desk-tool/structure-builder'
import {MdOutlineChatBubble} from 'react-icons/md'

const interviews = S.listItem()
  .title('Interviews')
  .icon(MdOutlineChatBubble)
  .child(
    S.documentTypeList('module')
      .filter('moduleType == "interview"')
      .title('All Interviews'),
  )

export default interviews
