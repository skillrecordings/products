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
      const getImage = () => {
        switch (type) {
          case 'Tip':
            return {alt: 'light bulp', src: '💡'}
          case 'Big Idea':
            return {alt: 'exploding head', src: '🤯'}
          case 'Reflection':
            return {alt: 'smiling face with sunglasses', src: '😎'}
          case 'Caution':
            return {alt: 'warning', src: '⚠️'}
          case 'Exercise':
            return {alt: 'pencil', src: '📝'}
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
