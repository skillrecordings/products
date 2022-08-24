export default {
  name: 'github',
  type: 'object',
  title: 'GitHub',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Zod Crash Course',
    },
    {
      name: 'repo',
      title: 'Repository',
      type: 'string',
      description: 'without https://github.com/total-typescript/',
    },
  ],
}
