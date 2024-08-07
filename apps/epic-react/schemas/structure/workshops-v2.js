import {MdOutlineRowing} from 'react-icons/md'

const workshopsV2 = (S) =>
  S.listItem()
    .title('Workshops V2')
    .icon(MdOutlineRowing)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "workshop-v2"')
        .title('All Workshops V2'),
    )

export default workshopsV2
