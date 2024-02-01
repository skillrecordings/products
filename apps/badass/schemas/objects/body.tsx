import {defineField, defineArrayMember} from 'sanity'
import {
  HiOutlineEmojiHappy,
  HiOutlineClock,
  HiExternalLink,
  HiLink,
} from 'react-icons/hi'
// import React, {forwardRef} from 'react'
// import {BlockEditor} from 'part:@sanity/form-builder'
// import {handlePaste} from '../../customization/onPaste'

// const CustomEditor = forwardRef((props, ref) => (
//   <BlockEditor {...props} ref={ref} onPaste={handlePaste} />
// ))
export default defineField({
  name: 'body',
  type: 'array',
  title: 'Body',
  of: [
    defineArrayMember({
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
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'External link',
            // blockEditor: {
            //   icon: HiExternalLink,
            // },
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
          }),
          defineArrayMember({
            name: 'internalLink',
            type: 'object',
            title: 'Internal link',
            // blockEditor: {
            //   icon: HiLink,
            // },
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [{type: 'lesson'}, {type: 'section'}, {type: 'module'}],
              },
            ],
          }),
          defineArrayMember({
            name: 'emoji',
            type: 'object',
            title: 'Emoji',
            // blockEditor: {
            //   icon: HiOutlineEmojiHappy,
            // },
            icon: HiOutlineEmojiHappy,
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
          }),
          defineArrayMember({
            name: 'timestamp',
            type: 'object',
            title: 'Timestamp',
            icon: HiOutlineClock,
            fields: [
              {
                name: 'timestamp',
                type: 'string',
                title: 'Timestamp',
                validation: (Rule) => Rule.required(),
              },
            ],
          }),
        ],
      },
    }),
    defineArrayMember({type: 'bodyImage'}),
    defineArrayMember({type: 'bodyImageFloated'}),
    defineArrayMember({type: 'specialHeading'}),
    defineArrayMember({type: 'bodyVideo'}),
    defineArrayMember({type: 'code'}),
    defineArrayMember({type: 'callout'}),
    defineArrayMember({type: 'divider'}),
    defineArrayMember({type: 'bodyGrid'}),
    defineArrayMember({type: 'bodyContributorProfile'}),
    defineArrayMember({type: 'bodyClientProfile'}),
    defineArrayMember({type: 'tweet'}),
  ],
  // inputComponent: CustomEditor,
})
