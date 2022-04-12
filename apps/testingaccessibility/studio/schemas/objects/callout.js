import React from 'react'

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
          {title: 'Tip', value: 'tip'},
          {title: 'Big Idea', value: 'big-idea'},
          {title: 'Reflection', value: 'reflection'},
          {title: 'Caution', value: 'caution'},
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
      return (
        <div style={{padding: 10, background: 'rgba(0,0,0,0.05)'}}>
          <b>{type}:</b> {body}
        </div>
      )
    },
  },
}
