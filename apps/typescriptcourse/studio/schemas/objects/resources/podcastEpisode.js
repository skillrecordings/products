import {IoMdMicrophone} from 'react-icons/io'

export default {
  name: 'podcastEpisode',
  title: 'Episode',
  type: 'document',
  icon: IoMdMicrophone,
  fields: [
    {
      name: 'title',
      title: 'Title',
      required: true,
      description: 'Remember that long titles can be truncated in podcast apps',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Episode slug',
      type: 'slug',
      description: 'When you need to refer to your podcast episode in a url',
      options: {
        source: 'title',
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    },
    {
      title: 'Published',
      name: 'published',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'simplecastId',
      title: 'Simplecast Episode ID',
      description: 'Used for the player embed.',
      type: 'string',
    },
    {
      name: 'duration',
      title: 'Duration',
      description: 'HH:MM:SS',
      type: 'string',
    },
    {
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
    },
    {
      name: 'content',
      title: 'Content',
      description:
        'An episode note. Where encoded is a string containing information about your episode.',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'concepts',
      title: 'Concepts',
      type: 'array',
      options: {
        layout: 'tags',
      },
      of: [{type: 'reference', weak: true, to: [{type: 'skosConcept'}]}],
    },
    {
      name: 'coverArt',
      title: 'Cover art',
      type: 'image',
    },
    {
      name: 'transcript',
      title: 'Transcript',
      description: 'A markdown transcript of the episode recording.',
      type: 'text',
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
      subtitle: 'podcast.0.title',
      description: 'summary',
      media: 'coverArt',
    },
    prepare({title, subtitle, description, media}) {
      return {
        title,
        description,
        media,
      }
    },
  },
}
