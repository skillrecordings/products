import React from 'react'

export default {
  name: 'emailButton',
  type: 'object',
  title: 'Button',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
    },
  ],
  preview: {
    select: {label: 'label', url: 'url'},
    component: ({value}) => {
      const {label, url} = value
      return label ? (
        <a href={url} style={{color: '#FFF', background: '#000', padding: 10}}>
          {label}
        </a>
      ) : (
        <div />
      )
    },
  },
}
