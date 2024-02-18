import React from 'react'
import {MdOutlineArticle} from 'react-icons/md'
import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: MdOutlineArticle,
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
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Author avatar',
      type: 'externalImage',
      validation: (Rule) => Rule.required(),
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
          {title: 'published', value: 'published'},
        ],
      },
    }),
    defineField({
      name: 'card_color',
      title: 'Card color',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'red',
      options: {
        list: [
          {title: 'red', value: 'red'},
          {title: 'green', value: 'green'},
        ],
      },
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'videoResource'}],
        }),
      ],
    }),
    defineField({
      name: 'articleHeaderImage',
      title: 'Header Image',
      type: 'externalImage',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'Used as a short summary (up to 160 chars)',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'markdownBody',
      title: 'Body (markdown)',
      type: 'markdown',
      // validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shareCardImage',
      title: 'Share Card Image',
      type: 'externalImage',
    }),
    defineField({
      name: 'concepts',
      title: 'Concepts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'skosConcept'}],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'externalImage.url',
      bgColor: 'card_color',
    },
    prepare(selection) {
      const {media, title, bgColor} = selection
      return {
        title,
        media: media && (
          <div
            style={{backgroundColor: bgColor, width: '100%', height: '100%'}}
          >
            <img src={media} alt={title} />
          </div>
        ),
      }
    },
  },
})
