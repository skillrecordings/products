import React from 'react'

export default {
  name: 'emailQuizQuestion',
  type: 'object',
  title: 'Quiz Question',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'question',
      title: 'Question',
      type: 'array',
      validation: (Rule) =>
        Rule.min(1)
          .error('A quiz must have at least one question')
          .max(1)
          .error('Max one question'),
      of: [
        {
          type: 'reference',
          to: [{type: 'question'}],
        },
      ],
    },
  ],
  preview: {
    select: {label: 'label', url: 'url'},
    component: ({value}) => {
      const {label, url} = value
      return label ? (
        <>
          <span>quiz:</span>{' '}
          <a
            href={url}
            style={{color: '#FFF', background: '#000', padding: 10}}
          >
            {label}
          </a>
        </>
      ) : (
        <div />
      )
    },
  },
}
