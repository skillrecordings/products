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
      name: 'productId',
      title: 'Product ID',
      type: 'string',
    }),
    {
      name: 'convertkitPurchasedTagId',
      title: 'Convertkit Purchase Tag ID',
      type: 'string',
    },
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
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'object',
      fields: [
        defineField({
          name: 'priceId',
          title: 'Price ID',
          type: 'string',
        }),
        defineField({
          name: 'amount',
          title: 'Amount',
          type: 'number',
        }),
      ],
    }),
    defineField({
      name: 'merchantPrice',
      title: 'Merchant Price',
      type: 'object',
      fields: [
        defineField({
          name: 'merchantPriceId',
          title: 'Merchant Price ID',
          type: 'string',
        }),
        defineField({
          name: 'merchantAccountId',
          title: 'Merchant Account ID',
          type: 'string',
        }),
        defineField({
          name: 'identifier',
          title: 'Identifier',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'merchantProduct',
      title: 'Merchant Product',
      type: 'object',
      fields: [
        defineField({
          name: 'merchantProductId',
          title: 'Merchant Product ID',
          type: 'string',
        }),
        defineField({
          name: 'merchantAccountId',
          title: 'Merchant Account ID',
          type: 'string',
        }),
        defineField({
          name: 'identifier',
          title: 'Identifier',
          type: 'string',
        }),
      ],
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
      name: 'upgredableFrom',
      title: 'Upgradable From',
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
      of: [defineArrayMember({type: 'reference', to: [{type: 'module'}]})],
    }),
    defineField({
      name: 'action',
      title: 'Call to action',
      type: 'string',
    }),
    defineField({name: 'image', title: 'Image', type: 'externalImage'}),
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
