export default {
  name: 'codeFile',
  title: 'Code File',
  type: 'object',
  description: 'To open in sandpack editor.',
  fields: [
    {
      name: 'filename',
      title: 'Filename',
      description: 'Filename with extension — index.html, styles.css, ...',
      type: 'string',
    },
    {
      name: 'active',
      title: 'Is active',
      description: 'Should tab with this file be active?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'code',
      title: 'Code',
      description: 'Plain code (without ```)',
      type: 'body',
    },
  ],
  preview: {
    select: {
      title: 'filename',
    },
  },
}
