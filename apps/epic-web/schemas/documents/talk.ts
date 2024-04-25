import {MdOutlineCoPresent} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'talk',
  type: 'document',
  title: 'Talk',
  icon: MdOutlineCoPresent,
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        media: MdOutlineCoPresent,
        title: `${title} (Talk)`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
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
                title: `${title}${
                  typeof role === 'string' ? ` (${role})` : ''
                }`,
                imageUrl,
              }
            },
          },
        },
        {
          type: 'object',
          name: 'oneTimeContributor',
          title: 'One-time contributor',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
            }),
            defineField({
              name: 'picture',
              title: 'Picture',
              type: 'image',
            }),
          ],
        },
      ],
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
      name: 'state',
      title: 'Current State',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'new',
      options: {
        list: [
          {title: 'new', value: 'new'},
          {title: 'processing', value: 'processing'},
          {title: 'reviewing', value: 'reviewing'},
          {title: 'published', value: 'published'},
          {title: 'retired', value: 'retired'},
        ],
      },
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({type: 'reference', to: [{type: 'videoResource'}]}),
        defineArrayMember({type: 'tweet'}),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'markdown',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'markdown',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    }),
  ],
})
