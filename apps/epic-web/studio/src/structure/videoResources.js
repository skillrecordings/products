import S from '@sanity/desk-tool/structure-builder'
import {GoDeviceCameraVideo} from 'react-icons/go'

const videoResources = S.listItem()
  .title('Video Resources')
  .icon(GoDeviceCameraVideo)
  .child(S.documentTypeList('videoResource').title('All Videos'))

export default videoResources
