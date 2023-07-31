import React from 'react'
import {FiTwitter} from 'react-icons/fi'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tweet',
  type: 'object',
  title: 'Tweet',
  icon: FiTwitter,
  fields: [
    defineField({
      name: 'tweetId',
      title: 'Tweet ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'label', title: 'Label', type: 'string'}),
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
  components: {
    preview: () => {
      return <div>Tweet</div>
    },
  },
})
