import {MdOutlineArticle} from 'react-icons/md'

export default {
  name: 'conceptPage',
  type: 'document',
  title: 'Concept Page',
  icon: MdOutlineArticle,
  fields: [
    {
      name: 'concept',
      title: 'Concept',
      type: 'reference',
      to: [{type: 'skosConcept'}],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
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
      name: 'description',
      title: 'SEO Description',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'body',
    },
  ],
}
