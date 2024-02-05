import {IoMdMicrophone} from 'react-icons/io'
import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'podcastEpisode',
  title: 'Episode',
  type: 'document',
  icon: IoMdMicrophone,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      validation: (Rule) => Rule.required(),
      description: 'Remember that long titles can be truncated in podcast apps',
      type: 'string',
    }),
    defineField({
      name: 'interviewee',
      title: 'Interviewee name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'season',
      description: 'Choose podcast seasons(s) to publish this episode in',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          weak: true,
          to: [{type: 'podcastSeason'}],
        }),
      ],
    }),
    defineField({
      name: 'schedule',
      type: 'schedule',
      title: 'Publish schedule',
    }),
    defineField({
      name: 'simplecastId',
      title: 'Simplecast Episode ID',
      description: 'Used for the player embed.',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      description: 'HH:MM:SS',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
    }),
    defineField({
      name: 'explicit',
      title: 'Explicit content',
      type: 'boolean',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description:
        'An episode summary is a string containing one or more descriptive sentences summarizing your episode for potential listeners. You can specify up to 4000 characters.',
      type: 'text',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: `An episode description is a string containing one or more sentences describing your episode to potential listeners. You can specify up to 4000 characters.`,
      type: 'markdown',
      validation: (Rule) => Rule.max(4000),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      description:
        'An episode note. Where encoded is a string containing information about your episode.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),
      ],
    }),
    defineField({
      name: 'linkList',
      title: 'Link list',
      description:
        'A more structured way to add links for show notes. Will be compiled at the end of the episode content field in a podcast RSS feed',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'linkListItem',
        }),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Episode slug',
      type: 'slug',
      description: 'When you need to refer to your podcast episode in a url',
      options: {
        source: 'title',
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      name: 'concepts',
      title: 'Concepts',
      type: 'array',
      options: {
        layout: 'tags',
      },
      of: [
        defineArrayMember({
          type: 'reference',
          weak: true,
          to: [{type: 'skosConcept'}],
        }),
      ],
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
    defineField({
      name: 'transcript',
      title: 'Transcript',
      description: 'A markdown transcript of the episode recording.',
      type: 'markdown',
    }),
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
})
