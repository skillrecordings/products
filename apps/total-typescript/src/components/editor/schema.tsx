import {defineType} from '@sanity/types'

export const portableTextType = defineType({
  type: 'array',
  name: 'body',
  of: [
    {
      type: 'block',
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'External link',

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

            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [{type: 'exercise'}, {type: 'module'}],
              },
            ],
          },
          {
            name: 'emoji',
            type: 'object',
            title: 'Emoji',
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
          {
            name: 'timestamp',
            type: 'object',
            title: 'Timestamp',
            fields: [
              {
                name: 'timestamp',
                type: 'string',
                title: 'Timestamp',
                validation: (Rule) => Rule.required(),
              },
            ],
          },
        ],
      },
    },
    {
      name: 'code',
      type: 'block',
      title: 'Code',
      components: {
        input: (props: any) => <div>{JSON.stringify(props)}</div>,
        preview: (props: any) => <div>{JSON.stringify(props)}</div>,
      },
      // icon: CodeBlockIcon,
      fields: [
        {
          name: 'language',
          title: 'Language',
          type: 'string',
        },
        {
          name: 'filename',
          title: 'Filename',
          type: 'string',
        },
        {
          title: 'Code',
          name: 'code',
          type: 'text',
        },
        {
          title: 'Highlighted lines',
          name: 'highlightedLines',
          type: 'array',
          of: [
            {
              type: 'number',
              title: 'Highlighted line',
            },
          ],
        },
      ],
      preview: {
        select: {
          language: 'language',
          code: 'code',
          filename: 'filename',
          highlightedLines: 'highlightedLines',
        },
        prepare: (value: {
          language?: string
          code?: string
          filename?: string
          highlightedLines?: number[]
        }) => {
          return {
            title:
              value.filename || (value.language || 'unknown').toUpperCase(),
            // media: getMedia(value?.language),
            selection: value,
          }
        },
      },
    },
  ],
})
