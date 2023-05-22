import React from 'react'
import {MdCode, MdInsertDriveFile} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'sandpack',
  type: 'object',
  title: 'Sandpack',
  icon: MdCode,
  fields: [
    defineField({
      name: 'files',
      title: 'Files',
      type: 'array',
      description: 'Code files to pass into the sandpack editor',
      of: [
        defineArrayMember({
          title: 'Code File',
          name: 'codeFile',
          type: 'object',
          fields: [
            defineField({
              name: 'file',
              title: 'File path with extension',
              type: 'string',
              description: 'e.g. index.html',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'code',
              title: 'Code',
              type: 'code',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              file: 'file',
            },
            prepare(selection) {
              const {file} = selection
              return {
                title: file,
                icon: MdInsertDriveFile,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Sandpack',
        icon: MdCode,
      }
    },
  },
})
