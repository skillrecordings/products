import React from 'react'

export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'productId',
      title: 'Product ID',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'feature'}],
    },
    {
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'module'}]}],
    },
    {
      name: 'action',
      title: 'Call to action',
      type: 'string',
    },
    {name: 'image', title: 'Image', type: 'externalImage'},
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      hidden: true,
    },
    {
      name: 'concepts',
      title: 'Concepts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'skosConcept'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image.url',
    },
    prepare(selection) {
      const {media, title} = selection
      return {
        title: title,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
}
