import {FaPodcast} from 'react-icons/fa'

export default {
  name: 'podcast',
  title: 'Podcast',
  description: 'Create and configure a podcast',
  icon: FaPodcast,
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description:
        'Remember that if your title is too long, it may be truncated in various podcatchers-',
    },
    {
      name: 'subtitle',
      type: 'string',
      description: 'That catchy tagline.',
    },
    {
      name: 'slug',
      title: 'Podcast slug',
      type: 'slug',
      description: 'For when you need to refer to your podcast in a url.',
      options: {
        source: 'title',
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      description:
        'What is this podcast about and why should people subscribe to it?',
    },
    {
      name: 'coverArt',
      title: 'Cover art',
      type: 'image',
      required: true,
      description:
        'The image should be either jpg or png. Preferably 3000 x 3000, minimum 1400 x 1400 pixels.',
    },
    {
      name: 'seasons',
      title: 'Seasons',
      type: 'array',
      of: [{type: 'reference', weak: true, to: [{type: 'podcastSeason'}]}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      description: 'description',
      media: 'coverArt',
    },
  },
}
