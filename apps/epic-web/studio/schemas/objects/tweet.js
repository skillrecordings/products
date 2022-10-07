import React from 'react'
import TweetEmbed from 'react-tweet-embed'

export default {
  name: 'tweet',
  type: 'object',
  title: 'Tweet',
  fields: [
    {
      name: 'id',
      type: 'string',
      title: 'Tweet ID',
    },
  ],
  preview: {
    select: {id: 'id'},
    component: ({value}) => {
      return <TweetEmbed tweetId={value.id} />
    },
  },
}
