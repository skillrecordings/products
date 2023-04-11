import React from 'react'

export default {
  name: 'bodyTweet',
  type: 'object',
  title: 'Tweet',
  fields: [
    {
      title: 'Tweet',
      name: 'text',
      type: 'body',
    },
    {
      name: 'url',
      title: 'Tweet URL',
      type: 'url',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
        },
        {
          name: 'handle',
          title: 'Handle',
          type: 'string',
        },
        {
          name: 'avatar',
          title: 'Avatar',
          type: 'image',
        },
      ],
    },
  ],
  preview: {
    select: {tweet: 'text'},
    component: ({value}) => {
      const {tweet} = value
      return <div>tweet: {tweet}</div>
    },
  },
}
