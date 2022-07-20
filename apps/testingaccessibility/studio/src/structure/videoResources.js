import S from '@sanity/desk-tool/structure-builder'
import {HiOutlineVideoCamera} from 'react-icons/hi'

const videoResources = S.listItem()
  .title('Video Resources')
  .icon(HiOutlineVideoCamera)
  .child(S.documentTypeList('videoResource').title('All Video Resources'))

export default videoResources
