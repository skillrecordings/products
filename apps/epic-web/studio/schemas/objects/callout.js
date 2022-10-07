import React from 'react'
import {PortableText} from '@portabletext/react'

export default {
  name: 'callout',
  type: 'object',
  title: 'Callout',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      initialValue: 'tip',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Highlight', value: 'highlight'},
          {title: 'Tip', value: 'tip'},
        ],
      },
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
  ],
  preview: {
    select: {body: 'body', type: 'type'},
    component: ({value}) => {
      const {body, type} = value
      const getImage = () => {
        switch (type) {
          case 'Highlight':
            return {alt: 'ballpoint pen', src: '🖊'}
          case 'Tip':
            return {alt: 'light bulp', src: '💡'}
          default:
            return {alt: 'speech baloon', src: '💬'}
        }
      }
      return (
        <div style={{padding: 10, background: 'rgba(0,0,0,0.05)'}}>
          <b>{getImage().src}</b> {body}
          <PortableText value={body} />
        </div>
      )
    },
  },
}
