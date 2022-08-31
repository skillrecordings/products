export default {
  title: 'Email Body',
  name: 'emailBody',
  type: 'array',
  of: [
    {
      type: 'block',
    },
    {
      type: 'emailImage',
    },
    {
      type: 'emailButton',
    },
    {
      type: 'code',
    },
    {
      type: 'emailQuizQuestion',
    },
  ],
}
