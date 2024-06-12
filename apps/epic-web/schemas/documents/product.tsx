import * as React from 'react'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'unitAmount',
      title: 'Unit Amount',
      description: 'Current Price',
      type: 'number',
      validation: (Rule) => Rule.min(1).required(),
    }),
    defineField({
      name: 'quantityAvailable',
      title: 'Quantity Available',
      description: 'Set to -1 for unlimited',
      type: 'number',
      initialValue: -1,
      validation: (Rule) => Rule.min(-1).required(),
    }),
    defineField({
      name: 'productId',
      title: 'Skill Product ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'convertkitPurchasedTagId',
      title: 'Convertkit Purchase Tag ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
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
    }),
    defineField({
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
          {title: 'archived', value: 'archived'},
        ],
      },
    }),
    defineField({
      name: 'upgradableTo',
      title: 'Upgradable To',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'product'}],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 20,
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [defineArrayMember({type: 'feature'})],
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'module'}, {type: 'event'}],
        }),
      ],
    }),
    defineField({
      name: 'action',
      title: 'Call to action',
      type: 'string',
    }),
    defineField({name: 'image', title: 'Image', type: 'externalImage'}),
    defineField({
      name: 'ogImage',
      title: 'Share card URL',
      type: 'url',
    }),
    defineField({
      name: 'welcomeVideo',
      title: 'Welcome Video',
      description: 'A video resource that will be shown on the product page',
      type: 'reference',
      to: [{type: 'videoResource'}],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      hidden: true,
    }),
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
})
