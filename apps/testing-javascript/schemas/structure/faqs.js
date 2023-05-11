import {MdOutlineQuestionAnswer} from 'react-icons/md'

const faqs = (S) =>
  S.listItem()
    .title('FAQs')
    .icon(MdOutlineQuestionAnswer)
    .child(S.documentTypeList('faq').title('FAQs'))

export default faqs
