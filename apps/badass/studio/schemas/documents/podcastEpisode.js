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
      name: 'season',
      description: 'Choose podcast seasons(s) to publish this episode in',
      type: 'array',
      of: [{type: 'reference', weak: true, to: [{type: 'podcastSeason'}]}],
    },
    {
      name: 'schedule',
      type: 'schedule',
      title: 'Publish schedule',
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
      name: 'explicit',
      title: 'Explicit content',
      type: 'boolean',
    },
    {
      name: 'summary',
      title: 'Summary',
      description:
        'An episode summary is a string containing one or more descriptive sentences summarizing your episode for potential listeners. You can specify up to 4000 characters.',
      type: 'text',
    },
    {
      name: 'description',
      title: 'Description',
      description: `An episode description is a string containing one or more sentences describing your episode to potential listeners. You can specify up to 4000 characters.`,
      type: 'text',
      validation: (Rule) => Rule.max(4000),
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
      name: 'linkList',
      title: 'Link list',
      description:
        'A more structured way to add links for show notes. Will be compiled at the end of the episode content field in a podcast RSS feed',
      type: 'array',
      of: [
        {
          type: 'linkListItem',
        },
      ],
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
      name: 'concepts',
      title: 'Concepts',
      type: 'array',
      options: {
        layout: 'tags',
      },
      of: [{type: 'reference', weak: true, to: [{type: 'skosConcept'}]}],
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
    {
      name: 'transcript',
      title: 'Transcript',
      description:
        'A markdown transcript of the episode recording.',
      type: 'markdown',
    },
  ],
  orderings: [
    {
      title: 'Publish Date, New',
      name: 'publishDateDesc',
      by: [{field: 'schedule.publish', direction: 'desc'}],
    },
    {
      title: 'Publish Date, Old',
      name: 'publishDateAsc',
      by: [{field: 'schedule.publish', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'podcast.0.title',
      description: 'summary',
      media: 'coverArt',
      schedule: 'schedule',
    },
    prepare({title, subtitle, description, media, schedule}) {
      return {
        title,
        esubtitle: `${new Date(schedule.publish).toDateString()} – ${subtitle}`,
        description,
        media,
      }
    },
  },
}
