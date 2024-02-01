import {VscGroupByRefType} from 'react-icons/vsc'

export default {
  name: 'podcastSeason',
  title: 'Season',
  type: 'document',
  icon: VscGroupByRefType,
  fields: [
    {
      name: 'title',
      title: 'Title',
      required: true,
      description: 'Remember that long titles can be truncated in podcast apps',
      type: 'string',
    },
    {
      name: 'podcast',
      description: 'Choose podcast(s) to publish this season in',
      type: 'array',
      of: [{type: 'reference', weak: true, to: [{type: 'podcast'}]}],
    },
    {
      name: 'episodes',
      description: 'Choose episodes(s) of this season',
      type: 'array',
      of: [{type: 'reference', weak: true, to: [{type: 'podcastEpisode'}]}],
    },
    {
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
    },
    {
      name: 'summary',
      title: 'Summary',
      description:
        'A season summary is a string containing one or more descriptive sentences summarizing your season for potential listeners. You can specify up to 4000 characters.',
      type: 'text',
    },
    {
      name: 'description',
      title: 'Description',
      description: `A season description is a string containing one or more sentences describing your season to potential listeners. You can specify up to 4000 characters.`,
      type: 'text',
      validation: (Rule) => Rule.max(4000),
    },
    {
      name: 'content',
      title: 'Content',
      description:
        'A season note. Where encoded is a string containing information about your season.',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'slug',
      title: 'Season slug',
      type: 'slug',
      description: 'When you need to refer to your podcast season in a url',
      options: {
        source: 'title',
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      options: {
        layout: 'tags',
      },
      of: [
        {
          type: 'string',
        },
      ],
    },
    {
      name: 'coverArt',
      title: 'Cover art',
      type: 'image',
    },
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
}
