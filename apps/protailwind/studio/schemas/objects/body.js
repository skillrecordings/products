import {
  HiOutlineEmojiHappy,
  HiExternalLink,
  HiLink,
  HiOutlineClock,
} from 'react-icons/hi'

import React, {forwardRef} from 'react'
import {BlockEditor} from 'part:@sanity/form-builder'
import {handlePaste} from '../../customization/onPaste'

const CustomEditor = forwardRef((props, ref) => (
  <BlockEditor {...props} ref={ref} onPaste={handlePaste} />
))

export default {
  name: 'body',
  type: 'array',
  of: [
    {
      type: 'block',
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
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [{type: 'article'}, {type: 'exercise'}],
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
          {
            name: 'timestamp',
            type: 'object',
            title: 'Timestamp',
            blockEditor: {
              icon: HiOutlineClock,
            },
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
    {type: 'bodyImage'},
    {type: 'bodyVideo'},
    {type: 'code'},
    {type: 'callout'},
    {type: 'divider'},
  ],
  inputComponent: CustomEditor,
}
