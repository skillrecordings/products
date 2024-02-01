import React from 'react'
import {defineType, defineField} from 'sanity'

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
    preview: (props: any) => {
      const {image} = props
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
