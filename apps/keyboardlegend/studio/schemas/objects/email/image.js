import React from 'react'

export default {
  name: 'emailImage',
  type: 'object',
  title: 'Image',
  fields: [
    {
      name: 'src',
      title: 'Image url',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
    },
    {
      name: 'width',
      title: 'Width',
      type: 'string',
    },
  ],
  preview: {
    select: {src: 'src', alt: 'alt', width: 'width'},
    component: ({value}) => {
      const {src, alt, width} = value
      return src ? (
        <img width={width || '100%'} height="auto" src={src} alt={alt} />
      ) : (
        <div>⚠️ missing image</div>
      )
    },
  },
}
