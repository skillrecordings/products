export default {
  name: 'github',
  type: 'object',
  title: 'GitHub',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'for labeling and display',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'repo',
      title: 'Repository',
      type: 'string',
      description: 'without https://github.com/total-typescript/',
      validation: (Rule: any) => Rule.required(),
    },
  ],
}
