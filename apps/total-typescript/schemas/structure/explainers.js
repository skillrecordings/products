import {MdRecordVoiceOver} from 'react-icons/md'

const explainers = (S) =>
  S.listItem()
    .title('Explainers')
    .icon(MdRecordVoiceOver)
    .child(S.documentTypeList('explainer').title('All Explainers'))

export default explainers
