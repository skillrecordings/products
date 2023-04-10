import {MdQuestionAnswer} from 'react-icons/md'

const testimonials = (S) =>
  S.listItem()
    .title('Testimonials')
    .icon(MdQuestionAnswer)
    .child(S.documentTypeList('testimonial').title('All Testimonials'))

export default testimonials
