import {MdMoney} from 'react-icons/md'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productRevenueSplit',
  type: 'object',
  title: 'Revenue Split',
  icon: MdMoney,
  fields: [
    defineField({
      name: 'type',
      title: 'Revenue Split Type',
      type: 'string',
      options: {
        list: ['skill', 'contributor', 'owner'],
      },
    }),
    defineField({
      name: 'contributor',
      title: 'Contributor',
      type: 'reference',
      to: [{type: 'contributor'}],
      hidden: ({parent}) => parent?.type !== 'contributor',
      validation: (Rule) =>
        Rule.custom((value, {parent}) => {
          if (parent?.type === 'contributor' && !value) {
            return 'Contributor is required when type is set to contributor'
          }
          return true
        }),
    }),
    defineField({
      name: 'percentage',
      title: 'Percentage',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(1).precision(4),
      description: 'Enter a decimal value between 0 and 1 (e.g., 0.25 for 25%)',
    }),
  ],
  preview: {
    select: {
      type: 'type',
      percentage: 'percentage',
      contributorName: 'contributor.name',
    },
    prepare(selection) {
      const {type, percentage, contributorName} = selection
      const title =
        type === 'contributor' && contributorName
          ? `${contributorName} (${type})`
          : type
      return {
        title: `${title} - ${(percentage * 100).toFixed(2)}%`,
      }
    },
  },
})
