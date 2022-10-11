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
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
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
      name: 'episodes',
      description: 'Choose episodes(s) of this season',
      type: 'array',
      of: [{type: 'reference', weak: true, to: [{type: 'podcastEpisode'}]}],
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
      name: 'coverArt',
      title: 'Cover art',
      type: 'image',
    },
    {
      name: 'ogImage',
      title: 'Share card URL',
      type: 'url',
    },
    {
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      validation: (Rule) => Rule.max(160),
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
