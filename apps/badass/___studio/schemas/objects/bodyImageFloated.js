import {number} from 'prop-types'
import React from 'react'

const FLOAT_SIDES = [
  {title: 'left', value: 'left'},
  {title: 'right', value: 'right'},
]

export default {
  name: 'bodyImageFloated',
  type: 'object',
  title: 'ImageFloated',
  fields: [
    {
      type: 'externalImage',
      name: 'image',
      title: 'Image',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'width',
      title: 'Width',
      type: 'number',
    },
    {
      name: 'height',
      title: 'Height',
      type: 'number',
    },
    {
      name: 'floatSide',
      title: 'Float side',
      type: 'string',
      options: {
        list: FLOAT_SIDES.map(({title, value}) => ({title, value})),
        layout: 'radio',
        defaultValue: 'left',
      },
    },
  ],
  preview: {
    select: {image: 'image', alt: 'alt'},
    component: ({value}) => {
      const {alt, image} = value
      return image ? (
        <>
          <div>
            <img width="100%" height="auto" src={image.url} alt={alt} />
          </div>
          {alt && <b>{alt}</b>}
        </>
      ) : (
        <div>⚠️ missing image</div>
      )
    },
  },
}
