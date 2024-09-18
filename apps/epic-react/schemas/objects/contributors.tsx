import React from 'react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contributors',
  type: 'array',
  title: 'Contributors',
  of: [
    {
      type: 'object',
      name: 'contributor',
      fields: [
        defineField({
          name: 'contributor',
          title: 'Contributor',
          type: 'reference',
          to: {type: 'contributor'},
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          title: 'Role',
          name: 'role',
          type: 'string',
          options: {
            list: [
              {title: 'Author', value: 'author'},
              {title: 'Instructor', value: 'instructor'},
              {title: 'Host', value: 'host'},
              {title: 'Presenter', value: 'presenter'},
              {title: 'Editor', value: 'editor'},
              {title: 'Reviewer', value: 'reviewer'},
              {title: 'Illustrator', value: 'illustrator'},
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: {
          title: 'contributor.name',
          role: 'role',
          imageUrl: 'contributor.picture.asset.url',
        },
        prepare(selection) {
          const {title, role, imageUrl} = selection
          return {
            title: `${title}${typeof role === 'string' ? ` (${role})` : ''}`,
            imageUrl,
          }
        },
      },
    },
  ],
})
