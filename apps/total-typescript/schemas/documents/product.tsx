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
      title: 'Skill Product ID',
      type: 'string',
    },
    {
      name: 'quantityAvailable',
      title: 'Quantity Available',
      type: 'number',
      description: 'Set to -1 for unlimited',
      initialValue: -1,
      validation: (Rule) => Rule.min(-1).required(),
    },
    {
      name: 'unitAmount',
      title: 'Unit Amount',
      description: 'Current Price',
      type: 'number',
      validation: (Rule) => Rule.min(1).required(),
    },
    {
      name: 'type',
      title: 'Product Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'self-paced',
      options: {
        list: [
          {title: 'self-paced', value: 'self-paced'},
          {title: 'live', value: 'live'},
        ],
      },
    },
    {
      name: 'convertkitPurchasedTagId',
      title: 'Convertkit Purchase Tag ID',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'state',
      title: 'Current State',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'draft',
      options: {
        list: [
          {title: 'draft', value: 'draft'},
          {title: 'active', value: 'active'},
          {title: 'unavailable', value: 'unavailable'},
        ],
      },
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
          to: [{type: 'concept'}],
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
