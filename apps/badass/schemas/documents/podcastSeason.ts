import {VscGroupByRefType} from 'react-icons/vsc'
import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'podcastSeason',
  title: 'Season',
  type: 'document',
  icon: VscGroupByRefType,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      validation: (Rule) => Rule.required(),
      description: 'Remember that long titles can be truncated in podcast apps',
      type: 'string',
    }),
    defineField({
      name: 'podcast',
      description: 'Choose podcast(s) to publish this season in',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          weak: true,
          to: [{type: 'podcast'}],
        }),
      ],
    }),
    defineField({
      name: 'episodes',
      description: 'Choose episodes(s) of this season',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          weak: true,
          to: [{type: 'podcastEpisode'}],
        }),
      ],
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description:
        'A season summary is a string containing one or more descriptive sentences summarizing your season for potential listeners. You can specify up to 4000 characters.',
      type: 'text',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: `A season description is a string containing one or more sentences describing your season to potential listeners. You can specify up to 4000 characters.`,
      type: 'text',
      validation: (Rule) => Rule.max(4000),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      description:
        'A season note. Where encoded is a string containing information about your season.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Season slug',
      type: 'slug',
      description: 'When you need to refer to your podcast season in a url',
      options: {
        source: 'title',
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      options: {
        layout: 'tags',
      },
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'coverArt',
      title: 'Cover art',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'summary',
      media: 'coverArt',
    },
    prepare({title, description, media}) {
      return {
        title,
        description,
        media,
      }
    },
  },
})
