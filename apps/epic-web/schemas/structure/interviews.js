import {HiMicrophone} from 'react-icons/hi'

const interviews = (S) =>
  S.listItem()
    .title('Interviews')
    .icon(HiMicrophone)
    .child(S.documentTypeList('interview').title('All Interviews'))

export default interviews
