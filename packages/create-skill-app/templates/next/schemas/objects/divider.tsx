import React from 'react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'divider',
  type: 'object',
  title: 'Divider',
  fields: [
    defineField({
      name: 'image',
      title: 'Image URL',
      type: 'string',
    }),
  ],
  preview: {
    select: {image: 'image'},
  },
  components: {
    preview: (value: any) => {
      const {image} = value
      return image ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={image} width={100 / 1.5} height={66 / 1.5} />
        </div>
      ) : (
        <hr />
      )
    },
  },
})
