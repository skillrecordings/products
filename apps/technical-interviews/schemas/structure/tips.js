import {HiFire} from 'react-icons/hi'

const exercises = (S) =>
  S.listItem()
    .title('Tips')
    .icon(HiFire)
    .child(S.documentTypeList('tip').title('All Tips'))

export default exercises
