import React from 'react'
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'bodyClientProfile',
  type: 'object',
  title: 'Client Profile',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      image: 'image.asset.url',
      description: 'description',
    },
  },
  components: {
    preview: (props: any) => {
      const {name, image, description} = props
      return name ? (
        <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
          {image && (
            <img
              src={image}
              width={70}
              height={70}
              style={{borderRadius: 35}}
            />
          )}
          <div>
            <strong>{name}</strong>
            {description && (
              <small>
                <br />
                {description}
              </small>
            )}
          </div>
        </div>
      ) : null
    },
  },
})
