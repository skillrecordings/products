import {MdOutlineQuestionAnswer} from 'react-icons/md'

export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: MdOutlineQuestionAnswer,
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'body',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'question',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: title,
      }
    },
  },
}
