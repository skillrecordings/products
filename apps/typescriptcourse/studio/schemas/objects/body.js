import {HiOutlineEmojiHappy, HiExternalLink, HiLink} from 'react-icons/hi'

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
      // ],
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'External link',
            blockEditor: {
              icon: HiExternalLink,
            },
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                description: 'Read https://css-tricks.com/use-target_blank/',
                type: 'boolean',
              },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal link',
            blockEditor: {
              icon: HiLink,
            },
            fields: [
              {
                name: 'hash',
                type: 'slug',
                title: 'Hash link',
                description: 'Link to specific element on a page using an id.',
                validation: (Rule) =>
                  Rule.custom((value) => {
                    if (typeof value === 'undefined') {
                      return true // Allow undefined values
                    }
                    // This would crash if we didn't check
                    // for undefined values first
                    return value.current.startsWith('#')
                      ? '# prefix is added automatically'
                      : true
                  }).error(),
              },
            ],
          },
          {
            name: 'emoji',
            type: 'object',
            title: 'Emoji',
            blockEditor: {
              icon: HiOutlineEmojiHappy,
            },
            fields: [
              {
                name: 'emoji',
                title: 'Emoji',
                type: 'object',
                fields: [
                  {
                    name: 'label',
                    type: 'string',
                    title: 'Label',
                    validation: (Rule) => Rule.required(),
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {type: 'bodyImage'},
    {type: 'code'},
    {type: 'callout'},
    {type: 'divider'},
    {type: 'twitter'},
  ],
}
