import {HiOutlineEmojiHappy, HiExternalLink, HiOutlineClock, HiLink} from 'react-icons/hi'
import React, {forwardRef} from 'react'
import {BlockEditor} from '@sanity/form-builder'
import {handlePaste} from '../../customization/onPaste'

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
  ],
}
