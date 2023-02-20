import {FiTwitter} from 'react-icons/fi'

export default {
  name: 'tweet',
  type: 'object',
  title: 'Tweet',
  icon: FiTwitter,
  fields: [
    {
      name: 'tweetId',
      title: 'Tweet ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {name: 'label', title: 'Label', type: 'string'},
  ],
  preview: {
    select: {
      file: 'FiTwitter',
    },
    prepare(selection) {
      return {
        title: 'Tweet',
      }
    },
  },
}
