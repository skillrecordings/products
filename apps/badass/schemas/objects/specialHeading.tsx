import React from 'react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'specialHeading',
  type: 'object',
  title: 'Special heading',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
    }),
  ],
  preview: {
    select: {text: 'text'},
  },
  components: {
    preview: (props: any) => {
      const {text} = props
      return text ? (
        <>
          <div>
            <h3>{text}</h3>
          </div>
        </>
      ) : (
        <div>⚠️ missing text</div>
      )
    },
  },
})
