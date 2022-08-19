export default {
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'video',
      title: 'Video',
      description: 'Mux PlaybackID',
      type: 'string',
    },
    {
      name: 'transcript',
      title: 'Transcript',
      type: 'body',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
    {
      name: 'stackblitz',
      type: 'stackblitz',
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
      slug: 'slug',
    },
    prepare(selection) {
      const {title, slug} = selection
      return {
        title: `${title} (${slug.current})`,
      }
    },
  },
}
