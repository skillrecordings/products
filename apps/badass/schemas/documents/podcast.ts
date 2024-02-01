import {FaPodcast} from 'react-icons/fa'
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'podcast',
  title: 'Podcast',
  description: 'Create and configure a podcast',
  icon: FaPodcast,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description:
        'Remember that if your title is too long, it may be truncated in various podcatchers-',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      description: 'That catchy tagline.',
    }),
    defineField({
      name: 'slug',
      title: 'Podcast slug',
      type: 'slug',
      description: 'For when you need to refer to your podcast in a url.',
      options: {
        source: 'title',
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
      validation: (Rule) => Rule.required(),
      description:
        'What is this podcast about and why should people subscribe to it?',
    }),
    defineField({
      name: 'coverArt',
      title: 'Cover art',
      type: 'image',
      validation: (Rule) => Rule.required(),
      description:
        'The image should be either jpg or png. Preferably 3000 x 3000, minimum 1400 x 1400 pixels.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      description: 'description',
      media: 'coverArt',
    },
  },
})
