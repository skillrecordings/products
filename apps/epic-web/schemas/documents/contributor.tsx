import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contributor',
  title: 'Contributor',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter handle',
      type: 'string',
      description: 'without @ symbol',
    }),
    defineField({
      name: 'saleAnnounceChannel',
      title: 'Slack Sale Announce Channel',
      type: 'string',
      description: 'the Ding Ding channel to announce sales',
    }),
    defineField({
      name: 'slackChannel',
      title: 'CC Slack Contributor Channel',
      type: 'string',
      description: 'the contributors work group in slack',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      description: 'A short bio about the author.',
      type: 'markdown',
    }),
    defineField({
      name: 'picture',
      title: 'Picture',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessiblity.',
        },
      ],
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'link',
          title: 'Link',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Label',
            },
            {
              name: 'url',
              type: 'url',
              title: 'URL',
            },
          ],
        },
      ],
    }),
  ],
})
