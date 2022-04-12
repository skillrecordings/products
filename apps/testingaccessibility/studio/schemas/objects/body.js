// TODO: Exercises (don't have to have solutions), Challenges (always have solutions, sometimes multiple parts)

export default {
  name: 'body',
  type: 'array',
  of: [
    {
      type: 'block',
      // styles: [
      //   {title: 'Normal', value: 'normal'},
      //   {title: 'H1', value: 'h1'},
      //   {title: 'H2', value: 'h2'},
      //   {title: 'H3', value: 'h3'},
      //   {title: 'H4', value: 'h4'},
      //   {title: 'H5', value: 'h5'},
      //   {title: 'H6', value: 'h6'},
      //   {title: 'Quote', value: 'blockquote'}
      // ]
    },
    {type: 'bodyImage'},
    {type: 'bodyVideo'},
    {type: 'code'},
    {type: 'callout'},
  ],
}
