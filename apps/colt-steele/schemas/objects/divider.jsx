import React from 'react'

export default {
  name: 'divider',
  type: 'object',
  title: 'Divider',
  fields: [
    {
      name: 'image',
      title: 'Image URL',
      type: 'string',
    },
  ],
  preview: {
    select: {image: 'image'},
    component: ({value}) => {
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
}
