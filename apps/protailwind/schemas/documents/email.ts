/* eslint-disable import/no-anonymous-default-export */
import {MdEmail} from 'react-icons/md'

export default {
  name: 'mail',
  title: 'Email',
  type: 'document',
  icon: MdEmail,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'body',
      title: 'Body',
      description:
        "Use {subscriber} to insert the subscriber's name. This is the email's body in MDX.",
      type: 'markdown',
    },
  ],
}
