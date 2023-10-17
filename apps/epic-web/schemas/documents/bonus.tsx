import {defineField, defineType} from 'sanity'
import {MdStars} from 'react-icons/md'

export default defineType({
  name: 'bonus',
  title: 'Product Bonus (non-module)',
  type: 'document',
  icon: MdStars,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      name: 'filter',
      title: 'Validation Filter',
      description: '{ppp: false, quantity: 1}',
      type: 'string',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires at (Pacific time)',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 1,
      },
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid from (Pacific time)',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 1,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: title,
      }
    },
  },
})
