import React from 'react'

export default {
  name: 'divider',
  type: 'object',
  title: 'Divider',
  initialValue: {
    image:
      'https://res.cloudinary.com/skill-recordings-inc/image/upload/v1656886439/divider_2x_tnsbrh.png',
  },
  fields: [
    {
      name: 'image',
      title: 'Image URL',
      type: 'string',
      description:
        'Use "after a solution" or between major topic change to help visually divide content.',
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
          <img src={image} width={200 / 1.5} height="100%" />
        </div>
      ) : (
        <hr />
      )
    },
  },
}
