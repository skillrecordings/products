import React from 'react'

export default {
  name: 'specialHeading',
  type: 'object',
  title: 'Special heading',
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'string',
    },
  ],
  preview: {
    select: {text: 'text'},
    component: ({value}) => {
      const {text} = value
      return text ? (
        <>
          <div>
            <h3>{text}</h3>
          </div>
        </>
      ) : (
        <div>⚠️ missing text</div>
      )
    },
  },
}
